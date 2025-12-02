/**
 * Database Indexes for Query Optimization
 * These indexes improve query performance for frequently accessed columns
 */

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id) WHERE google_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_trust_score ON users(trust_score DESC);
CREATE INDEX IF NOT EXISTS idx_users_seller_tier ON users(seller_tier);
CREATE INDEX IF NOT EXISTS idx_users_sanction_level ON users(sanction_level) WHERE sanction_level > 0;
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_verification_level ON users(verification_level);

-- Composite index for user lookups
CREATE INDEX IF NOT EXISTS idx_users_email_auth ON users(email, auth_provider);

-- Transactions table indexes
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_updated_at ON transactions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_buffer_end_time ON transactions(buffer_end_time) WHERE buffer_end_time IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transactions_dispute_deadline ON transactions(dispute_deadline) WHERE dispute_deadline IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transactions_risk_score ON transactions(risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_escalation_level ON transactions(escalation_level) WHERE escalation_level > 0;

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_transactions_user_status ON transactions(buyer_id, status);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_status ON transactions(seller_id, status);
CREATE INDEX IF NOT EXISTS idx_transactions_status_created ON transactions(status, created_at DESC);

-- Messages table indexes
CREATE INDEX IF NOT EXISTS idx_messages_transaction_id ON messages(transaction_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_flagged ON messages(flagged_as_scam) WHERE flagged_as_scam = true;

-- Composite index for transaction messages
CREATE INDEX IF NOT EXISTS idx_messages_transaction_created ON messages(transaction_id, created_at DESC);

-- Disputes table indexes
CREATE INDEX IF NOT EXISTS idx_disputes_transaction_id ON disputes(transaction_id);
CREATE INDEX IF NOT EXISTS idx_disputes_raised_by ON disputes(raised_by);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);
CREATE INDEX IF NOT EXISTS idx_disputes_priority_level ON disputes(priority_level);
CREATE INDEX IF NOT EXISTS idx_disputes_created_at ON disputes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_disputes_sla_deadline ON disputes(sla_deadline) WHERE sla_deadline IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_disputes_assigned_agent ON disputes(assigned_agent) WHERE assigned_agent IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_disputes_auto_flagged ON disputes(auto_flagged) WHERE auto_flagged = true;

-- Composite index for dispute resolution
CREATE INDEX IF NOT EXISTS idx_disputes_status_priority ON disputes(status, priority_level, created_at);

-- KYC Verifications indexes
CREATE INDEX IF NOT EXISTS idx_kyc_user_id ON kyc_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_status ON kyc_verifications(status);
CREATE INDEX IF NOT EXISTS idx_kyc_submitted_at ON kyc_verifications(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_kyc_user_status ON kyc_verifications(user_id, status);

-- Password Resets indexes
CREATE INDEX IF NOT EXISTS idx_password_resets_user_id ON password_resets(user_id);
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);
CREATE INDEX IF NOT EXISTS idx_password_resets_expires_at ON password_resets(expires_at);

-- Scam Reports indexes
CREATE INDEX IF NOT EXISTS idx_scam_reports_reporter_id ON scam_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_scam_reports_status ON scam_reports(status);
CREATE INDEX IF NOT EXISTS idx_scam_reports_created_at ON scam_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scam_reports_is_public ON scam_reports(is_public) WHERE is_public = true;

-- Sanctions indexes
CREATE INDEX IF NOT EXISTS idx_sanctions_user_id ON sanctions(user_id);
CREATE INDEX IF NOT EXISTS idx_sanctions_is_active ON sanctions(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_sanctions_expires_at ON sanctions(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sanctions_user_active ON sanctions(user_id, is_active) WHERE is_active = true;

-- Escalation Queue indexes
CREATE INDEX IF NOT EXISTS idx_escalation_queue_dispute_id ON escalation_queue(dispute_id);
CREATE INDEX IF NOT EXISTS idx_escalation_queue_queue_type ON escalation_queue(queue_type);
CREATE INDEX IF NOT EXISTS idx_escalation_queue_position ON escalation_queue(position);
CREATE INDEX IF NOT EXISTS idx_escalation_queue_type_position ON escalation_queue(queue_type, position);

-- API Keys indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_developer_id ON api_keys(developer_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_api_keys_expires_at ON api_keys(expires_at) WHERE expires_at IS NOT NULL;

-- API Usage Logs indexes (for analytics and rate limiting)
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_api_key_id ON api_usage_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_developer_id ON api_usage_logs(developer_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_created_at ON api_usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_endpoint ON api_usage_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_status_code ON api_usage_logs(status_code);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_developer_endpoint ON api_usage_logs(developer_id, endpoint, created_at DESC);

-- Developer Accounts indexes
CREATE INDEX IF NOT EXISTS idx_developer_accounts_user_id ON developer_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_developer_accounts_status ON developer_accounts(status);

-- Partial indexes for better performance on filtered queries
CREATE INDEX IF NOT EXISTS idx_transactions_active ON transactions(id, status, updated_at) WHERE status IN ('active', 'escrow', 'buffer_period');
CREATE INDEX IF NOT EXISTS idx_users_active_sellers ON users(id, seller_tier, trust_score) WHERE sanction_level = 0 AND is_verified = true;
CREATE INDEX IF NOT EXISTS idx_disputes_open ON disputes(id, priority_level, created_at) WHERE status = 'open';

-- Full-text search indexes (if needed for search functionality)
-- CREATE INDEX IF NOT EXISTS idx_transactions_title_search ON transactions USING gin(to_tsvector('english', title));
-- CREATE INDEX IF NOT EXISTS idx_messages_content_search ON messages USING gin(to_tsvector('english', content));

