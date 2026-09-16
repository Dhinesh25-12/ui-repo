variable "aws_region" {
  description = "AWS region to create the state backend resources in"
  type        = string
  default     = "us-east-1"
}

variable "state_bucket_name" {
  description = "Globally unique name for the S3 bucket used to store Terraform state"
  type        = string
  default     = "insurance-portal-terraform-state"
}

variable "lock_table_name" {
  description = "Name of the DynamoDB table used for Terraform state locking"
  type        = string
  default     = "insurance-portal-terraform-locks"
}
