variable "bucket_name" {
  description = "Globally unique name for the S3 bucket"
  type        = string
}

variable "enable_versioning" {
  description = "Whether to enable object versioning on the bucket"
  type        = bool
  default     = true
}

variable "enable_lifecycle_rule" {
  description = "Whether to enable a lifecycle rule that expires noncurrent versions"
  type        = bool
  default     = true
}

variable "noncurrent_version_expiration_days" {
  description = "Number of days after which noncurrent object versions expire"
  type        = number
  default     = 90
}

variable "tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default     = {}
}
