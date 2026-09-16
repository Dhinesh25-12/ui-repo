output "instance_ids" {
  description = "IDs of the created EC2 instances"
  value       = aws_instance.app[*].id
}

output "public_ips" {
  description = "Public IP addresses of the created EC2 instances"
  value       = aws_instance.app[*].public_ip
}

output "private_ips" {
  description = "Private IP addresses of the created EC2 instances"
  value       = aws_instance.app[*].private_ip
}
