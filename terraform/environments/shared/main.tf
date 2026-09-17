terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = local.common_tags
  }
}

locals {
  common_tags = merge(var.tags, {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  })

  # Values sourced from backend-repo's Terraform state instead of being
  # created here. Update the attribute names on the right-hand side to
  # match backend-repo's actual outputs.
  vpc_id                 = data.terraform_remote_state.backend.outputs[var.backend_vpc_id_output]
  app_subnet_ids         = data.terraform_remote_state.backend.outputs[var.backend_subnet_ids_output]
  app_security_group_ids = [data.terraform_remote_state.backend.outputs[var.backend_security_group_id_output]]
}

data "aws_caller_identity" "current" {}

############################################
# Deployment artifact storage
#
# Bucket the CI workflow (.github/workflows/deploy-ui.yml) publishes
# `dist/insurance-portal` to, and that the EC2 instances sync from on
# boot/periodically via the compute module's nginx user_data script.
############################################
module "storage" {
  source = "../../modules/storage"

  bucket_name       = "${var.project_name}-${var.environment}-ui-deploy-${data.aws_caller_identity.current.account_id}"
  enable_versioning = true
  tags              = local.common_tags
}

############################################
# IAM: EC2 instance profile with read-only access to the deployment bucket
############################################
data "aws_iam_policy_document" "ui_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ui_instance" {
  name               = "${var.project_name}-${var.environment}-ui-instance-role"
  assume_role_policy = data.aws_iam_policy_document.ui_assume_role.json
  tags               = local.common_tags
}

data "aws_iam_policy_document" "ui_deploy_bucket_read" {
  statement {
    actions   = ["s3:ListBucket"]
    resources = [module.storage.bucket_arn]
  }

  statement {
    actions   = ["s3:GetObject"]
    resources = ["${module.storage.bucket_arn}/*"]
  }
}

resource "aws_iam_role_policy" "ui_deploy_bucket_read" {
  name   = "${var.project_name}-${var.environment}-ui-deploy-bucket-read"
  role   = aws_iam_role.ui_instance.id
  policy = data.aws_iam_policy_document.ui_deploy_bucket_read.json
}

resource "aws_iam_instance_profile" "ui_instance" {
  name = "${var.project_name}-${var.environment}-ui-instance-profile"
  role = aws_iam_role.ui_instance.name
}

############################################
# Compute: EC2 instance(s) serving the Angular build via nginx
############################################
module "compute" {
  source = "../../modules/compute"

  project_name       = var.project_name
  environment        = var.environment
  instance_count     = var.instance_count
  instance_type      = var.instance_type
  subnet_ids         = local.app_subnet_ids
  security_group_ids = local.app_security_group_ids
  key_name           = var.key_name

  iam_instance_profile    = aws_iam_instance_profile.ui_instance.name
  enable_nginx_deployment = true
  deployment_bucket       = module.storage.bucket_id
  deployment_key_prefix   = var.deployment_key_prefix

  tags = local.common_tags
}
