-- Create account_deletion_requests table
CREATE TABLE IF NOT EXISTS account_deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID REFERENCES auth.users(id),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_account_deletion_requests_user_id ON account_deletion_requests(user_id);
CREATE INDEX idx_account_deletion_requests_status ON account_deletion_requests(status);
CREATE INDEX idx_account_deletion_requests_requested_at ON account_deletion_requests(requested_at DESC);

-- Add RLS (Row Level Security) policies
ALTER TABLE account_deletion_requests ENABLE ROW LEVEL SECURITY;

-- Users can only see their own deletion requests
CREATE POLICY "Users can view their own deletion requests"
  ON account_deletion_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only create deletion requests for themselves
CREATE POLICY "Users can create their own deletion requests"
  ON account_deletion_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only admins can update deletion requests (you'll need to implement admin role check)
-- For now, we'll allow service role only
CREATE POLICY "Only service role can update deletion requests"
  ON account_deletion_requests
  FOR UPDATE
  USING (false); -- Will be handled by service role key

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_account_deletion_requests_updated_at
  BEFORE UPDATE ON account_deletion_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE account_deletion_requests IS 'Stores user account deletion requests with their reasons and processing status';
COMMENT ON COLUMN account_deletion_requests.status IS 'Status of the deletion request: pending, approved, rejected, or completed';
COMMENT ON COLUMN account_deletion_requests.metadata IS 'Additional metadata like user agent, IP address, processing notes, etc.';
