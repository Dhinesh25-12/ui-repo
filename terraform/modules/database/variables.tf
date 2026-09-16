variable "project_name" {
  description = "Name of the project, used as a prefix for resource names"
  type        = string
}

variable "environment" {
  description = "Deployment environment (e.g. dev, staging, prod)"
  type        = string
}

variable "subnet_ids" {
  description = "List of (private) subnet IDs for the DB subnet group"
  type        = list(string)
}

variable "security_group_ids" {
  description = "List of security group IDs to attach to the database instance"
  type        = list(string)
}

variable "engine" {
  description = "Database engine (e.g. mysql, postgres)"
  type        = string
  default     = "postgres"
}

variable "engine_version" {
  description = "Database engine version"
  type        = string
  default     = "16.4"
}

variable "instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "allocated_storage" {
  description = "Initial allocated storage in GB"
  type        = number
  default     = 20
}

variable "max_allocated_storage" {
  description = "Maximum storage for autoscaling in GB"
  type        = number
  default     = 100
}

variable "db_name" {
  description = "Name of the default database to create"
  type        = string
}

variable "username" {
  description = "Master username for the database"
  type        = string
  sensitive   = true
}

variable "password" {
  description = "Master password for the database"
  type        = string
  sensitive   = true
}

variable "port" {
  description = "Port the database listens on"
  type        = number
  default     = 5432
}

variable "multi_az" {
  description = "Whether to deploy a multi-AZ standby for high availability"
  type        = bool
  default     = false
}

variable "backup_retention_period" {
  description = "Number of days to retain automated backups"
  type        = number
  default     = 7
}

variable "skip_final_snapshot" {
  description = "Whether to skip the final snapshot when destroying the instance"
  type        = bool
  default     = true
}

variable "deletion_protection" {
  description = "Whether to enable deletion protection on the database instance"
  type        = bool
  default     = false
}

variable "tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default     = {}
}
