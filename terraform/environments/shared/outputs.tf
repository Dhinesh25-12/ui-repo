output "vpc_id" {
  description = "ID of the shared VPC (sourced from backend-repo)"
  value       = local.vpc_id
}

output "app_subnet_ids" {
  description = "Subnet IDs the UI EC2 instances were launched into (sourced from backend-repo)"
  value       = local.app_subnet_ids
}

output "app_instance_public_ips" {
  description = "Public IP addresses of the application EC2 instances"
  value       = module.compute.public_ips
}

output "app_instance_ids" {
  description = "IDs of the application EC2 instances"
  value       = module.compute.instance_ids
}

output "deployment_bucket_name" {
  description = "Name of the S3 bucket the CI workflow publishes the Angular build to"
  value       = module.storage.bucket_id
}
