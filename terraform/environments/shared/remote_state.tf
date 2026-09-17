############################################
# Remote state lookup: backend-repo
#
# Reads backend-repo's Terraform state to reuse its VPC, subnets,
# security groups and monitoring instead of provisioning a duplicate
# stack. Point backend_state_bucket/backend_state_key at the actual
# bucket/key backend-repo's Terraform uses (see its backend.hcl.example).
#
# NOTE: the attribute names under module.backend.outputs.* below
# (vpc_id, public_subnet_ids, alb_security_group_id, ...) must match
# whatever backend-repo's root module actually exposes as outputs.
# Adjust them to match backend-repo before applying.
############################################

data "terraform_remote_state" "backend" {
  backend = "s3"

  config = {
    bucket = var.backend_state_bucket
    key    = var.backend_state_key
    region = var.backend_state_region
  }
}
