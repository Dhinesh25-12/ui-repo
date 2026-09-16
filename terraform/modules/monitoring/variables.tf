variable "project_name" {
  description = "Name of the project, used as a prefix for resource names"
  type        = string
}

variable "environment" {
  description = "Deployment environment (e.g. dev, staging, prod)"
  type        = string
}

variable "instance_ids" {
  description = "List of EC2 instance IDs to monitor"
  type        = list(string)
  default     = []
}

variable "db_instance_id" {
  description = "RDS instance identifier to monitor, if any"
  type        = string
  default     = null
}

variable "alert_email" {
  description = "Email address to subscribe to alert notifications"
  type        = string
  default     = null
}

variable "log_retention_days" {
  description = "Number of days to retain application logs"
  type        = number
  default     = 30
}

variable "cpu_alarm_threshold" {
  description = "CPU utilization percentage threshold that triggers an alarm for compute instances"
  type        = number
  default     = 80
}

variable "db_cpu_alarm_threshold" {
  description = "CPU utilization percentage threshold that triggers an alarm for the database"
  type        = number
  default     = 80
}

variable "tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default     = {}
}
