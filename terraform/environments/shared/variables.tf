variable "aws_region" {
  description = "AWS region to deploy resources into"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project, used as a prefix for resource names"
  type        = string
  default     = "insurance-portal"
}

variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "dev"
}

variable "tags" {
  description = "Additional common tags to apply to all resources"
  type        = map(string)
  default     = {}
}

############################################
# backend-repo remote state lookup
############################################
variable "backend_state_bucket" {
  description = "Name of the S3 bucket backend-repo's Terraform state is stored in"
  type        = string
}

variable "backend_state_key" {
  description = "State file key (path) backend-repo's Terraform uses within backend_state_bucket"
  type        = string
  default     = "dev/terraform.tfstate"
}

variable "backend_state_region" {
  description = "AWS region of the backend-repo state bucket"
  type        = string
  default     = "us-east-1"
}

variable "backend_vpc_id_output" {
  description = "Name of the output in backend-repo's state that exposes the shared VPC ID"
  type        = string
  default     = "vpc_id"
}

variable "backend_subnet_ids_output" {
  description = "Name of the output in backend-repo's state that exposes the subnet IDs the UI EC2 instances should launch into (typically public subnets, or private subnets if fronted by a load balancer)"
  type        = string
  default     = "public_subnet_ids"
}

variable "backend_security_group_id_output" {
  description = "Name of the output in backend-repo's state that exposes a security group ID allowing inbound HTTP/HTTPS suitable for the UI instances. If backend-repo doesn't already expose one, add it there rather than creating a duplicate security group here"
  type        = string
  default     = "web_security_group_id"
}

############################################
# Compute
############################################
variable "instance_count" {
  description = "Number of EC2 application instances to create"
  type        = number
  default     = 1
}

variable "instance_type" {
  description = "EC2 instance type for the application tier"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Name of an existing EC2 key pair for SSH access"
  type        = string
  default     = null
}

variable "deployment_key_prefix" {
  description = "S3 key prefix (folder) under the deployment bucket where the CI workflow publishes dist/insurance-portal"
  type        = string
  default     = "insurance-portal"
}
