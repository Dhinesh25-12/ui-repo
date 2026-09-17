############################################
# Compute module: EC2 instance(s)
############################################

data "aws_ami" "amazon_linux" {
  count       = var.ami_id == null ? 1 : 0
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

locals {
  ami_id = var.ami_id != null ? var.ami_id : data.aws_ami.amazon_linux[0].id

  rendered_user_data = var.user_data != null ? var.user_data : (
    var.enable_nginx_deployment ? templatefile("${path.module}/templates/user_data.sh.tpl", {
      deployment_bucket     = var.deployment_bucket
      deployment_key_prefix = var.deployment_key_prefix
    }) : null
  )
}

resource "aws_instance" "app" {
  count                       = var.instance_count
  ami                         = local.ami_id
  instance_type               = var.instance_type
  subnet_id                   = element(var.subnet_ids, count.index % length(var.subnet_ids))
  vpc_security_group_ids      = var.security_group_ids
  key_name                    = var.key_name
  associate_public_ip_address = var.associate_public_ip_address
  iam_instance_profile        = var.iam_instance_profile
  user_data                   = local.rendered_user_data

  root_block_device {
    volume_size = var.root_volume_size
    volume_type = "gp3"
    encrypted   = true
  }

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-app-${count.index + 1}"
  })
}
