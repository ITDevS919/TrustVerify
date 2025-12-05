/**
 * Create Database Tables
 * Creates the workflow and webhook tables if they don't exist
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

