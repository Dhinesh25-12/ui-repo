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
}

############################################
# Network
############################################
module "network" {
  source = "../../modules/network"

  project_name         = var.project_name
  environment          = var.environment
  vpc_cidr             = var.vpc_cidr
  availability_zones   = var.availability_zones
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  enable_nat_gateway   = var.enable_nat_gateway
  tags                 = local.common_tags
}

############################################
# Security Groups
############################################
module "security" {
  source = "../../modules/security"

  project_name  = var.project_name
  environment   = var.environment
  vpc_id        = module.network.vpc_id
  database_port = var.db_port
  tags          = local.common_tags
}

############################################
# Storage
############################################
module "storage" {
  source = "../../modules/storage"

  bucket_name       = "${var.project_name}-${var.environment}-storage-${data.aws_caller_identity.current.account_id}"
  enable_versioning = true
  tags              = local.common_tags
}

############################################
# Compute
############################################
module "compute" {
  source = "../../modules/compute"

  project_name       = var.project_name
  environment        = var.environment
  instance_count     = var.instance_count
  instance_type      = var.instance_type
  subnet_ids         = module.network.public_subnet_ids
  security_group_ids = [module.security.web_security_group_id]
  key_name           = var.key_name
  tags               = local.common_tags
}

############################################
# Database
############################################
module "database" {
  source = "../../modules/database"

  project_name        = var.project_name
  environment         = var.environment
  subnet_ids          = module.network.private_subnet_ids
  security_group_ids  = [module.security.database_security_group_id]
  engine              = var.db_engine
  engine_version      = var.db_engine_version
  instance_class      = var.db_instance_class
  db_name             = var.db_name
  username            = var.db_username
  password            = var.db_password
  port                = var.db_port
  multi_az            = var.db_multi_az
  deletion_protection = var.db_deletion_protection
  tags                = local.common_tags
}

############################################
# Monitoring
############################################
module "monitoring" {
  source = "../../modules/monitoring"

  project_name   = var.project_name
  environment    = var.environment
  instance_ids   = module.compute.instance_ids
  db_instance_id = module.database.db_instance_id
  alert_email    = var.alert_email
  tags           = local.common_tags
}

data "aws_caller_identity" "current" {}
