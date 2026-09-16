# Cloud Infrastructure (Terraform)

This directory provisions the cloud infrastructure required to deploy the
Insurance Policy Management Portal (UI + backing API) on AWS.

## Components

| Requirement          | AWS Implementation                                    |
|-----------------------|--------------------------------------------------------|
| Compute               | EC2 instances (`modules/compute`)                      |
| Managed SQL Database  | RDS instance, Postgres by default (`modules/database`) |
| Object Storage        | S3 bucket with versioning & encryption (`modules/storage`) |
| Cloud Monitoring      | CloudWatch log group, metric alarms, SNS alerts (`modules/monitoring`) |
| Networking            | VPC, public/private subnets, IGW, NAT (`modules/network`) |
| Security Groups       | Web and database security groups (`modules/security`)  |

## Layout

```
terraform/
  bootstrap/            # One-time setup of the S3 state bucket + DynamoDB lock table
  modules/
    network/             # VPC, subnets, route tables, NAT gateway
    security/             # Security groups for web and database tiers
    compute/               # EC2 application instances
    database/              # RDS managed SQL database
    storage/                # S3 object storage bucket
    monitoring/              # CloudWatch log group, alarms, SNS topic
  environments/
    dev/                  # Root module wiring all modules together for the dev environment
```

## State Management

Terraform state is stored remotely in an S3 bucket with DynamoDB-backed
locking (see `environments/dev/backend.tf`). Since a backend cannot create
its own storage, the bucket and lock table must be created once via the
`bootstrap` configuration (which uses local state):

```bash
cd terraform/bootstrap
terraform init
terraform apply
```

## Usage

1. Bootstrap the remote state backend (once per AWS account), as above.
2. Configure environment variables:
   ```bash
   cd terraform/environments/dev
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars as needed
   export TF_VAR_db_password="<a-strong-password>"
   ```
3. Initialize and apply:
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

## Notes

- The database password is required and must be supplied via `TF_VAR_db_password`
  or a secrets manager — it is intentionally not set in `terraform.tfvars.example`.
- Additional environments (e.g. `staging`, `prod`) can be added by copying the
  `dev` directory and adjusting `backend.tf` (state `key`) and `terraform.tfvars`.
