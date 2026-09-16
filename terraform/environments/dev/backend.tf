############################################
# Backend: remote state management
#
# Uses an S3 bucket for state storage with a DynamoDB table for
# state locking. The bucket/table must be created out-of-band (e.g. via
# `terraform/bootstrap`) before running `terraform init` here, since a
# backend configuration cannot provision its own storage.
############################################

terraform {
  backend "s3" {
    bucket         = "insurance-portal-terraform-state"
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "insurance-portal-terraform-locks"
    encrypt        = true
  }
}
