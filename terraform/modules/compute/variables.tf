variable "project_name" {
  description = "Name of the project, used as a prefix for resource names"
  type        = string
}

variable "environment" {
  description = "Deployment environment (e.g. dev, staging, prod)"
  type        = string
}

variable "instance_count" {
  description = "Number of EC2 instances to create"
  type        = number
  default     = 1
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "ami_id" {
  description = "AMI ID to use for the instances. If null, the latest Amazon Linux 2023 AMI is used"
  type        = string
  default     = null
}

variable "subnet_ids" {
  description = "List of subnet IDs to launch the instances into"
  type        = list(string)
}

variable "security_group_ids" {
  description = "List of security group IDs to attach to the instances"
  type        = list(string)
}

variable "key_name" {
  description = "Name of an existing EC2 key pair for SSH access"
  type        = string
  default     = null
}

variable "associate_public_ip_address" {
  description = "Whether to associate a public IP address with the instances"
  type        = bool
  default     = true
}

variable "root_volume_size" {
  description = "Size (in GB) of the root EBS volume"
  type        = number
  default     = 20
}

variable "user_data" {
  description = "User data script to run on instance boot"
  type        = string
  default     = null
}

variable "tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default     = {}
}
