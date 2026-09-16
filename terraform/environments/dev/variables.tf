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
# Network
############################################
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones to spread subnets across"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "enable_nat_gateway" {
  description = "Whether to provision a NAT gateway for private subnet egress"
  type        = bool
  default     = true
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

############################################
# Database
############################################
variable "db_engine" {
  description = "Database engine (e.g. mysql, postgres)"
  type        = string
  default     = "postgres"
}

variable "db_engine_version" {
  description = "Database engine version"
  type        = string
  default     = "16.4"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "Name of the default database to create"
  type        = string
  default     = "insuranceportal"
}

variable "db_username" {
  description = "Master username for the database"
  type        = string
  sensitive   = true
  default     = "dbadmin"
}

variable "db_password" {
  description = "Master password for the database. Provide via TF_VAR_db_password or a secrets manager; do not hardcode in tfvars files"
  type        = string
  sensitive   = true
}

variable "db_port" {
  description = "Port the database listens on"
  type        = number
  default     = 5432
}

variable "db_multi_az" {
  description = "Whether to deploy a multi-AZ standby for high availability"
  type        = bool
  default     = false
}

variable "db_deletion_protection" {
  description = "Whether to enable deletion protection on the database instance"
  type        = bool
  default     = false
}

############################################
# Monitoring
############################################
variable "alert_email" {
  description = "Email address to subscribe to CloudWatch alert notifications"
  type        = string
  default     = null
}
