############################################
# Backend: remote state management
#
# This is the "shared stack" (Option B) topology: it does NOT create its
# own VPC/security groups/RDS/monitoring. Instead it reuses backend-repo's
# network/security outputs (see remote_state.tf) and only provisions the
# EC2 instance(s) that serve the Angular build, plus the S3 bucket the CI
# workflow publishes the build to.
#
# Uses the same UI-owned state bucket/table as environments/dev, but a
# distinct key so the two topologies never collide even if both are
# applied in the same account.
############################################

terraform {
  backend "s3" {
    bucket         = "insurance-portal-ui-terraform-state"
    key            = "ui/shared/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "insurance-portal-ui-terraform-locks"
    encrypt        = true
  }
}
