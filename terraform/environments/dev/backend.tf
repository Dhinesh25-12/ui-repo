############################################
# Backend: remote state management
#
# Uses an S3 bucket for state storage with a DynamoDB table for
# state locking. The bucket/table must be created out-of-band (e.g. via
# `terraform/bootstrap`) before running `terraform init` here, since a
# backend configuration cannot provision its own storage.
#
# This is the "two independent stacks" (standalone) topology: it
# provisions its own VPC/RDS/security groups/monitoring, duplicating
# backend-repo's infrastructure under the same project_name. The
# bucket/table names below are intentionally distinct from
# backend-repo's (insurance-portal-tfstate / insurance-portal-tf-locks)
# and the key is scoped under `ui/` to avoid state collisions if both
# stacks are applied to the same AWS account. Prefer
# `terraform/environments/shared` (Option B) instead, which reuses
# backend-repo's network/security/monitoring and avoids duplicate
# infrastructure entirely.
############################################

terraform {
  backend "s3" {
    bucket         = "insurance-portal-ui-terraform-state"
    key            = "ui/dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "insurance-portal-ui-terraform-locks"
    encrypt        = true
  }
}
