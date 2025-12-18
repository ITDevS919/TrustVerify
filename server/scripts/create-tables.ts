/**
 * Create Database Tables
 * Creates the workflow, webhook, and subscription tables if they don't exist
 */

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set');
}

const sql = neon(process.env.DATABASE_URL);

async function createTables() {
  console.log('Creating database tables...');

  try {
    // Check if users table exists
    const usersTableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `;
    
    if (!usersTableCheck[0]?.exists) {
      console.error('✗ Error: users table does not exist. Please create the users table first.');
      throw new Error('users table does not exist. The users table must be created before running this script.');
    }
    console.log('✓ Verified users table exists');

    // Create workflow_configurations table
    await sql`
      CREATE TABLE IF NOT EXISTS workflow_configurations (
        id SERIAL PRIMARY KEY,
        developer_id INTEGER NOT NULL REFERENCES developer_accounts(id),
        name TEXT NOT NULL,
        description TEXT,
        industry TEXT NOT NULL,
        use_case TEXT NOT NULL,
        workflow_steps JSONB NOT NULL,
        rules JSONB DEFAULT '{}',
        triggers JSONB DEFAULT '[]',
        is_active BOOLEAN DEFAULT true,
        is_template BOOLEAN DEFAULT false,
        version INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✓ Created workflow_configurations table');

    // Create industry_templates table
    await sql`
      CREATE TABLE IF NOT EXISTS industry_templates (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        industry TEXT NOT NULL,
        use_case TEXT NOT NULL,
        description TEXT,
        workflow_steps JSONB NOT NULL,
        default_rules JSONB DEFAULT '{}',
        recommended_settings JSONB DEFAULT '{}',
        documentation TEXT,
        code_examples JSONB DEFAULT '[]',
        is_public BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✓ Created industry_templates table');

    // Create webhook_configurations table
    await sql`
      CREATE TABLE IF NOT EXISTS webhook_configurations (
        id SERIAL PRIMARY KEY,
        developer_id INTEGER NOT NULL REFERENCES developer_accounts(id),
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        secret TEXT NOT NULL,
        events JSONB DEFAULT '[]',
        is_active BOOLEAN DEFAULT true,
        retry_policy JSONB DEFAULT '{"maxRetries": 3, "backoff": "exponential"}'::jsonb,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✓ Created webhook_configurations table');

    // Create webhook_deliveries table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS webhook_deliveries (
          id SERIAL PRIMARY KEY,
          webhook_id INTEGER NOT NULL REFERENCES webhook_configurations(id),
          event_type TEXT NOT NULL,
          payload JSONB NOT NULL,
          status TEXT DEFAULT 'pending',
          status_code INTEGER,
          response_body TEXT,
          attempt_number INTEGER DEFAULT 1,
          delivered_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      console.log('✓ Created webhook_deliveries table');
    } catch (err: any) {
      // Table might already exist or connection issue
      if (err.message?.includes('already exists') || err.message?.includes('relation')) {
        console.log('⚠ webhook_deliveries table may already exist, skipping...');
      } else {
        throw err;
      }
    }

    // Create indexes for better performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_workflow_configurations_developer_id 
      ON workflow_configurations(developer_id);
    `;
    console.log('✓ Created index on workflow_configurations.developer_id');

    await sql`
      CREATE INDEX IF NOT EXISTS idx_workflow_configurations_industry 
      ON workflow_configurations(industry);
    `;
    console.log('✓ Created index on workflow_configurations.industry');

    await sql`
      CREATE INDEX IF NOT EXISTS idx_industry_templates_industry 
      ON industry_templates(industry);
    `;
    console.log('✓ Created index on industry_templates.industry');

    await sql`
      CREATE INDEX IF NOT EXISTS idx_webhook_configurations_developer_id 
      ON webhook_configurations(developer_id);
    `;
    console.log('✓ Created index on webhook_configurations.developer_id');

    await sql`
      CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook_id 
      ON webhook_deliveries(webhook_id);
    `;
    console.log('✓ Created index on webhook_deliveries.webhook_id');

    // Create subscription_plans table
    await sql`
      CREATE TABLE IF NOT EXISTS subscription_plans (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        display_name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        currency TEXT DEFAULT 'USD',
        interval TEXT NOT NULL,
        stripe_price_id TEXT UNIQUE,
        stripe_product_id TEXT,
        features JSONB DEFAULT '[]',
        limits JSONB DEFAULT '{}',
        is_active BOOLEAN DEFAULT true,
        is_public BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✓ Created subscription_plans table');

    // Create user_subscriptions table
    await sql`
      CREATE TABLE IF NOT EXISTS user_subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        plan_id INTEGER NOT NULL REFERENCES subscription_plans(id),
        status TEXT NOT NULL DEFAULT 'active',
        stripe_subscription_id TEXT UNIQUE,
        stripe_customer_id TEXT,
        current_period_start TIMESTAMP NOT NULL,
        current_period_end TIMESTAMP NOT NULL,
        cancel_at_period_end BOOLEAN DEFAULT false,
        canceled_at TIMESTAMP,
        trial_start TIMESTAMP,
        trial_end TIMESTAMP,
        quantity INTEGER DEFAULT 1,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✓ Created user_subscriptions table');

    // Create subscription_invoices table
    await sql`
      CREATE TABLE IF NOT EXISTS subscription_invoices (
        id SERIAL PRIMARY KEY,
        subscription_id INTEGER NOT NULL REFERENCES user_subscriptions(id),
        user_id INTEGER NOT NULL REFERENCES users(id),
        stripe_invoice_id TEXT UNIQUE,
        amount DECIMAL(10, 2) NOT NULL,
        currency TEXT DEFAULT 'USD',
        status TEXT NOT NULL DEFAULT 'draft',
        hosted_invoice_url TEXT,
        invoice_pdf TEXT,
        period_start TIMESTAMP,
        period_end TIMESTAMP,
        paid_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✓ Created subscription_invoices table');

    // Create subscription_usage table
    await sql`
      CREATE TABLE IF NOT EXISTS subscription_usage (
        id SERIAL PRIMARY KEY,
        subscription_id INTEGER NOT NULL REFERENCES user_subscriptions(id),
        user_id INTEGER NOT NULL REFERENCES users(id),
        metric TEXT NOT NULL,
        quantity INTEGER DEFAULT 0,
        period_start TIMESTAMP NOT NULL,
        period_end TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✓ Created subscription_usage table');

    // Create indexes for subscription tables
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id 
      ON user_subscriptions(user_id);
    `;
    console.log('✓ Created index on user_subscriptions.user_id');

    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_id 
      ON user_subscriptions(stripe_subscription_id);
    `;
    console.log('✓ Created index on user_subscriptions.stripe_subscription_id');

    await sql`
      CREATE INDEX IF NOT EXISTS idx_subscription_invoices_user_id 
      ON subscription_invoices(user_id);
    `;
    console.log('✓ Created index on subscription_invoices.user_id');

    await sql`
      CREATE INDEX IF NOT EXISTS idx_subscription_usage_subscription_id 
      ON subscription_usage(subscription_id);
    `;
    console.log('✓ Created index on subscription_usage.subscription_id');

    // Create file_storage table for KYC/KYB documents
    await sql`
      CREATE TABLE IF NOT EXISTS file_storage (
        id SERIAL PRIMARY KEY,
        file_id TEXT NOT NULL UNIQUE,
        user_id INTEGER NOT NULL REFERENCES users(id),
        file_name TEXT NOT NULL,
        original_name TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        size INTEGER NOT NULL,
        storage_provider TEXT NOT NULL,
        storage_key TEXT NOT NULL,
        file_type TEXT NOT NULL,
        checksum TEXT,
        encrypted BOOLEAN DEFAULT false,
        uploaded_at TIMESTAMP DEFAULT NOW(),
        expires_at TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `;
    console.log('✓ Created file_storage table');

    // Create indexes for file_storage table
    await sql`
      CREATE INDEX IF NOT EXISTS idx_file_storage_user_id 
      ON file_storage(user_id);
    `;
    console.log('✓ Created index on file_storage.user_id');

    await sql`
      CREATE INDEX IF NOT EXISTS idx_file_storage_file_id 
      ON file_storage(file_id);
    `;
    console.log('✓ Created index on file_storage.file_id');

    await sql`
      CREATE INDEX IF NOT EXISTS idx_file_storage_file_type 
      ON file_storage(file_type);
    `;
    console.log('✓ Created index on file_storage.file_type');

    // Create CRM tables
    // Drop and recreate if they exist without proper structure
    await sql`DROP TABLE IF EXISTS crm_interactions CASCADE;`;
    await sql`DROP TABLE IF EXISTS crm_opportunities CASCADE;`;
    await sql`DROP TABLE IF EXISTS crm_leads CASCADE;`;
    await sql`DROP TABLE IF EXISTS crm_contacts CASCADE;`;
    
    await sql`
      CREATE TABLE crm_contacts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        company TEXT,
        job_title TEXT,
        address TEXT,
        city TEXT,
        country TEXT,
        postal_code TEXT,
        website TEXT,
        status TEXT DEFAULT 'active',
        source TEXT,
        tags JSONB DEFAULT '[]',
        notes TEXT,
        custom_fields JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✓ Created crm_contacts table');

    await sql`
      CREATE TABLE crm_leads (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        contact_id INTEGER REFERENCES crm_contacts(id),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        company TEXT,
        job_title TEXT,
        source TEXT NOT NULL,
        status TEXT DEFAULT 'new',
        score INTEGER DEFAULT 0,
        estimated_value DECIMAL(12, 2),
        currency TEXT DEFAULT 'GBP',
        notes TEXT,
        assigned_to INTEGER REFERENCES users(id),
        converted_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✓ Created crm_leads table');

    await sql`
      CREATE TABLE crm_opportunities (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        contact_id INTEGER REFERENCES crm_contacts(id),
        lead_id INTEGER REFERENCES crm_leads(id),
        name TEXT NOT NULL,
        description TEXT,
        stage TEXT DEFAULT 'prospecting',
        probability INTEGER DEFAULT 0,
        value DECIMAL(12, 2) NOT NULL,
        currency TEXT DEFAULT 'GBP',
        expected_close_date TIMESTAMP,
        actual_close_date TIMESTAMP,
        assigned_to INTEGER REFERENCES users(id),
        notes TEXT,
        tags JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✓ Created crm_opportunities table');

    await sql`
      CREATE TABLE crm_interactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        contact_id INTEGER REFERENCES crm_contacts(id),
        lead_id INTEGER REFERENCES crm_leads(id),
        opportunity_id INTEGER REFERENCES crm_opportunities(id),
        type TEXT NOT NULL,
        subject TEXT,
        description TEXT NOT NULL,
        direction TEXT DEFAULT 'outbound',
        duration INTEGER,
        outcome TEXT,
        next_action TEXT,
        next_action_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✓ Created crm_interactions table');

    // Create HR tables
    // Drop and recreate if they exist without proper structure
    await sql`DROP TABLE IF EXISTS hr_job_applications CASCADE;`;
    await sql`DROP TABLE IF EXISTS hr_recruitment CASCADE;`;
    await sql`DROP TABLE IF EXISTS hr_performance_reviews CASCADE;`;
    await sql`DROP TABLE IF EXISTS hr_leave_requests CASCADE;`;
    await sql`DROP TABLE IF EXISTS hr_attendance CASCADE;`;
    await sql`DROP TABLE IF EXISTS hr_employees CASCADE;`;
    
    await sql`
      CREATE TABLE hr_employees (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id),
        employee_id TEXT NOT NULL UNIQUE,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        date_of_birth TIMESTAMP,
        address TEXT,
        city TEXT,
        country TEXT,
        postal_code TEXT,
        emergency_contact_name TEXT,
        emergency_contact_phone TEXT,
        emergency_contact_relation TEXT,
        department TEXT,
        position TEXT NOT NULL,
        job_title TEXT NOT NULL,
        employment_type TEXT DEFAULT 'full_time',
        status TEXT DEFAULT 'active',
        hire_date TIMESTAMP NOT NULL,
        termination_date TIMESTAMP,
        salary DECIMAL(12, 2),
        currency TEXT DEFAULT 'GBP',
        manager_id INTEGER REFERENCES hr_employees(id),
        work_location TEXT,
        notes TEXT,
        custom_fields JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✓ Created hr_employees table');

    await sql`
      CREATE TABLE IF NOT EXISTS hr_attendance (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER NOT NULL REFERENCES hr_employees(id),
        date TIMESTAMP NOT NULL,
        check_in TIMESTAMP,
        check_out TIMESTAMP,
        break_duration INTEGER DEFAULT 0,
        total_hours DECIMAL(5, 2),
        status TEXT DEFAULT 'present',
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✓ Created hr_attendance table');

    await sql`
      CREATE TABLE IF NOT EXISTS hr_leave_requests (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER NOT NULL REFERENCES hr_employees(id),
        leave_type TEXT NOT NULL,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        days INTEGER NOT NULL,
        reason TEXT,
        status TEXT DEFAULT 'pending',
        approved_by INTEGER REFERENCES hr_employees(id),
        approved_at TIMESTAMP,
        rejection_reason TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✓ Created hr_leave_requests table');

    await sql`
      CREATE TABLE IF NOT EXISTS hr_performance_reviews (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER NOT NULL REFERENCES hr_employees(id),
        review_period TEXT NOT NULL,
        review_date TIMESTAMP NOT NULL,
        reviewed_by INTEGER NOT NULL REFERENCES hr_employees(id),
        overall_rating INTEGER,
        goals JSONB DEFAULT '[]',
        achievements TEXT,
        areas_for_improvement TEXT,
        feedback TEXT,
        next_review_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✓ Created hr_performance_reviews table');

    await sql`
      CREATE TABLE IF NOT EXISTS hr_recruitment (
        id SERIAL PRIMARY KEY,
        position TEXT NOT NULL,
        department TEXT,
        job_description TEXT,
        requirements JSONB DEFAULT '[]',
        status TEXT DEFAULT 'open',
        posted_date TIMESTAMP DEFAULT NOW(),
        closing_date TIMESTAMP,
        salary_range TEXT,
        employment_type TEXT DEFAULT 'full_time',
        location TEXT,
        recruiter_id INTEGER REFERENCES hr_employees(id),
        number_of_positions INTEGER DEFAULT 1,
        filled_positions INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✓ Created hr_recruitment table');

    await sql`
      CREATE TABLE IF NOT EXISTS hr_job_applications (
        id SERIAL PRIMARY KEY,
        recruitment_id INTEGER NOT NULL REFERENCES hr_recruitment(id),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        resume_url TEXT,
        cover_letter TEXT,
        status TEXT DEFAULT 'applied',
        stage TEXT,
        interview_date TIMESTAMP,
        interview_notes TEXT,
        rating INTEGER,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✓ Created hr_job_applications table');

    // Verify table structures before creating indexes
    console.log('Verifying table structures...');
    const tablesToCheck = [
      { name: 'crm_contacts', hasUserId: true },
      { name: 'crm_leads', hasUserId: true },
      { name: 'crm_opportunities', hasUserId: true },
      { name: 'crm_interactions', hasUserId: true },
      { name: 'hr_employees', hasUserId: true },
    ];

    for (const table of tablesToCheck) {
      if (table.hasUserId) {
        const columnCheck = await sql`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = ${table.name} AND column_name = 'user_id';
        `;
        if (columnCheck.length === 0) {
          console.error(`✗ Error: ${table.name} table does not have user_id column`);
          console.error(`  This might mean the table was created without the foreign key constraint.`);
          console.error(`  Please drop and recreate the ${table.name} table.`);
          throw new Error(`${table.name} table structure is incorrect - user_id column missing`);
        }
        console.log(`✓ Verified ${table.name} has user_id column`);
      }
    }

    // Create indexes for CRM tables
    await sql`
      CREATE INDEX IF NOT EXISTS idx_crm_contacts_user_id 
      ON crm_contacts(user_id);
    `;
    console.log('✓ Created index on crm_contacts.user_id');
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_crm_leads_user_id 
      ON crm_leads(user_id);
    `;
    console.log('✓ Created index on crm_leads.user_id');
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_crm_opportunities_user_id 
      ON crm_opportunities(user_id);
    `;
    console.log('✓ Created index on crm_opportunities.user_id');
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_crm_interactions_user_id 
      ON crm_interactions(user_id);
    `;
    console.log('✓ Created index on crm_interactions.user_id');

    // Create indexes for HR tables
    await sql`
      CREATE INDEX IF NOT EXISTS idx_hr_employees_user_id 
      ON hr_employees(user_id);
    `;
    console.log('✓ Created index on hr_employees.user_id');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_hr_attendance_employee_id 
      ON hr_attendance(employee_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_hr_leave_requests_employee_id 
      ON hr_leave_requests(employee_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_hr_performance_reviews_employee_id 
      ON hr_performance_reviews(employee_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_hr_job_applications_recruitment_id 
      ON hr_job_applications(recruitment_id);
    `;
    console.log('✓ Created indexes for CRM and HR tables');

    // Create homepage_content table
    await sql`
      CREATE TABLE IF NOT EXISTS homepage_content (
        id SERIAL PRIMARY KEY,
        section TEXT NOT NULL,
        key TEXT NOT NULL,
        content_type TEXT NOT NULL,
        value TEXT,
        image_url TEXT,
        json_data JSONB,
        "order" INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✓ Created homepage_content table');

    await sql`
      CREATE INDEX IF NOT EXISTS idx_homepage_content_section 
      ON homepage_content(section);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_homepage_content_key 
      ON homepage_content(key);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_homepage_content_section_key 
      ON homepage_content(section, key);
    `;
    console.log('✓ Created indexes for homepage_content table');

    // Seed initial homepage content
    console.log('\nSeeding initial homepage content...');
    
    // Check if content already exists
    const existingContent = await sql`
      SELECT COUNT(*) as count FROM homepage_content WHERE section = 'hero_slider';
    `;
    
    if (existingContent[0]?.count === 0 || existingContent[0]?.count === '0') {
      // Seed Hero Slider content for all 3 slides
      const featuresJson = {
        features: [
          { icon: "/fi-18890334.svg", text: "Evidence-Driven" },
          { icon: "/fi-2311992.svg", text: "Privacy-First" },
          { icon: "/fi-4086231.svg", text: "Community-Backed" }
        ]
      };

      // Slide 1
      await sql`
        INSERT INTO homepage_content (section, key, content_type, value, image_url, json_data, "order", is_active)
        VALUES 
          ('hero_slider', 'slide_1_badge_text', 'text', 'PROTECTING EVERY TRANSACTION, EVERYWHERE', NULL, NULL, 1, true),
          ('hero_slider', 'slide_1_badge_icon', 'image', NULL, '/background-17.svg', NULL, 1, true),
          ('hero_slider', 'slide_1_title_image', 'image', NULL, '/heading-1---insurance-plans-for-life-s-journey.svg', NULL, 1, true),
          ('hero_slider', 'slide_1_background', 'image', NULL, '/Hero1.png', NULL, 1, true),
          ('hero_slider', 'slide_1_description', 'text', 'Our advanced security network spans across 195+ countries, monitoring billions of transactions in real-time to ensure your financial operations remain secure no matter where business takes you.', NULL, NULL, 1, true),
          ('hero_slider', 'slide_1_features', 'json', NULL, NULL, ${JSON.stringify(featuresJson)}::jsonb, 1, true);
      `;

      // Slide 2
      await sql`
        INSERT INTO homepage_content (section, key, content_type, value, image_url, json_data, "order", is_active)
        VALUES 
          ('hero_slider', 'slide_2_badge_text', 'text', 'INTELLIGENCE THAT NEVER SLEEP', NULL, NULL, 2, true),
          ('hero_slider', 'slide_2_badge_icon', 'image', NULL, '/background-1.svg', NULL, 2, true),
          ('hero_slider', 'slide_2_title_image', 'image', NULL, '/heading-1---insurance-plans-for-life-s-journey-1.svg', NULL, 2, true),
          ('hero_slider', 'slide_2_background', 'image', NULL, '/Hero2.png', NULL, 2, true),
          ('hero_slider', 'slide_2_description', 'text', 'Machine learning algorithms analyze transaction patterns, behavioral biometrics, and risk indicators to identify and prevent fraud before it happens, with 99.7% accuracy.', NULL, NULL, 2, true),
          ('hero_slider', 'slide_2_features', 'json', NULL, NULL, ${JSON.stringify(featuresJson)}::jsonb, 2, true);
      `;

      // Slide 3
      await sql`
        INSERT INTO homepage_content (section, key, content_type, value, image_url, json_data, "order", is_active)
        VALUES 
          ('hero_slider', 'slide_3_badge_text', 'text', 'YOUR TRUST, OUR FOUNDATION', NULL, NULL, 3, true),
          ('hero_slider', 'slide_3_badge_icon', 'image', NULL, '/background-4.svg', NULL, 3, true),
          ('hero_slider', 'slide_3_title_image', 'image', NULL, '/heading-1---insurance-plans-for-life-s-journey-2.svg', NULL, 3, true),
          ('hero_slider', 'slide_3_background', 'image', NULL, '/Hero3.png', NULL, 3, true),
          ('hero_slider', 'slide_3_description', 'text', 'Bank-grade encryption, multi-layered authentication, and continuous monitoring create an impenetrable shield around your financial data and transactions.', NULL, NULL, 3, true),
          ('hero_slider', 'slide_3_features', 'json', NULL, NULL, ${JSON.stringify(featuresJson)}::jsonb, 3, true);
      `;
      console.log('✓ Seeded hero slider content (3 slides)');
    } else {
      console.log('⚠ Homepage content already exists, skipping seed');
    }

    // Seed decorative images
    const decorativeCheck = await sql`
      SELECT COUNT(*) as count FROM homepage_content WHERE section = 'decorative_images';
    `;
    
    if (decorativeCheck[0]?.count === 0 || decorativeCheck[0]?.count === '0') {
      await sql`
        INSERT INTO homepage_content (section, key, content_type, value, image_url, json_data, "order", is_active)
        VALUES 
          ('decorative_images', 'decorative_nate_shape', 'image', NULL, '/nate-shape.svg', NULL, 1, true),
          ('decorative_images', 'decorative_star_1', 'image', NULL, '/icon-star.svg', NULL, 2, true),
          ('decorative_images', 'decorative_star_2', 'image', NULL, '/icon-star-3.svg', NULL, 3, true),
          ('decorative_images', 'decorative_star_3', 'image', NULL, '/icon-star.svg', NULL, 4, true),
          ('decorative_images', 'decorative_star_4', 'image', NULL, '/icon-star-1.svg', NULL, 5, true);
      `;
      console.log('✓ Seeded decorative images');
    }

    // Seed partners section content
    const partnersCheck = await sql`
      SELECT COUNT(*) as count FROM homepage_content WHERE section = 'partners';
    `;
    
    if (partnersCheck[0]?.count === 0 || partnersCheck[0]?.count === '0') {
      await sql`
        INSERT INTO homepage_content (section, key, content_type, value, image_url, json_data, "order", is_active)
        VALUES 
          ('partners', 'partners_badge_text', 'text', 'OUR PARTNERS', NULL, NULL, 1, true),
          ('partners', 'partners_title', 'text', 'Build Trust With Leading Companies', NULL, NULL, 1, true),
          ('partners', 'partners_description', 'text', 'TrustVerify Launched in 2025. We''re actively onboarding our first Enterprise clients and will showcase their partnerships here as they join platforms.', NULL, NULL, 1, true);
      `;
      console.log('✓ Seeded partners section content');
    }

    console.log('\n✅ All tables created successfully!');
  } catch (error: any) {
    console.error('✗ Error creating tables:', error.message);
    throw error;
  }
}

// Run if executed directly
createTables()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });

