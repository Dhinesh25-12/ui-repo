output "vpc_id" {
  description = "ID of the VPC"
  value       = module.network.vpc_id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = module.network.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = module.network.private_subnet_ids
}

output "web_security_group_id" {
  description = "ID of the web/application security group"
  value       = module.security.web_security_group_id
}

output "database_security_group_id" {
  description = "ID of the database security group"
  value       = module.security.database_security_group_id
}

output "app_instance_public_ips" {
  description = "Public IP addresses of the application EC2 instances"
  value       = module.compute.public_ips
}

output "db_endpoint" {
  description = "Connection endpoint of the managed database"
  value       = module.database.db_endpoint
}

output "storage_bucket_name" {
  description = "Name of the object storage bucket"
  value       = module.storage.bucket_id
}

output "monitoring_sns_topic_arn" {
  description = "ARN of the SNS topic used for monitoring alerts"
  value       = module.monitoring.sns_topic_arn
}

output "monitoring_log_group_name" {
  description = "Name of the CloudWatch log group for the application"
  value       = module.monitoring.log_group_name
}
