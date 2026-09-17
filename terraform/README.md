# Cloud Infrastructure (Terraform)

This directory provisions the cloud infrastructure required to deploy the
Insurance Policy Management Portal UI on AWS. The backing API is
provisioned separately by `backend-repo/terraform` (ECS Fargate, RDS,
ALB, etc.).

## Two topologies

Because `backend-repo/terraform` already provisions a full VPC, RDS,
security groups and monitoring under the same `project_name`
(`insurance-portal`), this repo offers two ways to deploy the UI's EC2
instance(s) without duplicating that infrastructure:

| Environment                    | Topology                                                                 | When to use |
|---------------------------------|---------------------------------------------------------------------------|-------------|
| `environments/shared` (**recommended**) | Reuses backend-repo's VPC/subnets/security groups via `terraform_remote_state`. Only provisions the UI's EC2 instance(s) + a deployment S3 bucket + IAM role. | Deploying both repos into the same AWS account/environment, avoiding duplicate VPC/RDS/monitoring cost. |
| `environments/dev`               | Fully standalone: provisions its own VPC, security groups, RDS, S3, monitoring, and EC2 instances. | Deploying the UI independently of backend-repo, or into a separate account/environment, at the cost of duplicated infrastructure and no private connectivity to backend-repo's resources by default. |

If you use `environments/dev`, give the backend API's ALB DNS name to the
UI (see "Wiring the API URL" below) and, if you want private connectivity
instead of talking to the ALB over the public internet, set up VPC
peering between the two stacks' VPCs.

## Components

| Requirement          | AWS Implementation                                    | `shared` | `dev` |
|-----------------------|--------------------------------------------------------|:--------:|:-----:|
| Compute               | EC2 instances (`modules/compute`), serving the Angular build via nginx | ✅ | ✅ |
| Deployment artifact storage | S3 bucket the CI workflow publishes `dist/insurance-portal` to (`modules/storage`) | ✅ | ✅ (general-purpose bucket) |
| Managed SQL Database  | RDS instance, Postgres by default (`modules/database`) | – (reuses backend-repo's) | ✅ |
| Cloud Monitoring      | CloudWatch log group, metric alarms, SNS alerts (`modules/monitoring`) | – (reuses backend-repo's) | ✅ |
| Networking            | VPC, public/private subnets, IGW, NAT (`modules/network`) | – (reuses backend-repo's) | ✅ |
| Security Groups       | Web and database security groups (`modules/security`)  | – (reuses backend-repo's) | ✅ |

## Layout

```
terraform/
  bootstrap/            # One-time setup of the S3 state bucket + DynamoDB lock table
  modules/
    network/             # VPC, subnets, route tables, NAT gateway
    security/             # Security groups for web and database tiers
    compute/               # EC2 application instances (nginx + S3-synced Angular build)
    database/              # RDS managed SQL database
    storage/                # S3 object storage bucket
    monitoring/              # CloudWatch log group, alarms, SNS topic
  environments/
    shared/               # Recommended: EC2 + deployment bucket only, reusing backend-repo's network/security
    dev/                  # Standalone: wires all modules together, duplicating backend-repo's infra
```

## State Management

Terraform state is stored remotely in an S3 bucket with DynamoDB-backed
locking (see `environments/*/backend.tf`). The bucket/table are named
`insurance-portal-ui-terraform-state` / `insurance-portal-ui-terraform-locks`
— deliberately distinct from backend-repo's `insurance-portal-tfstate` /
`insurance-portal-tf-locks` — and each environment uses its own state
`key` (`ui/shared/...`, `ui/dev/...`) so the two topologies never
collide even if both are applied. Since a backend cannot create its own
storage, the bucket and lock table must be created once via the
`bootstrap` configuration (which uses local state):

```bash
cd terraform/bootstrap
terraform init
terraform apply
```

## Usage: shared stack (recommended)

1. Bootstrap the remote state backend (once per AWS account), as above.
2. Apply `backend-repo/terraform` first, and note its state bucket/key
   and the output names it uses for the VPC ID, subnet IDs and a
   security group allowing inbound HTTP/HTTPS.
3. Configure environment variables:
   ```bash
   cd terraform/environments/shared
   cp terraform.tfvars.example terraform.tfvars
   # Point backend_state_bucket/backend_state_key/backend_*_output at
   # backend-repo's actual state location and output names.
   ```
4. Initialize and apply:
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```
5. Configure the `.github/workflows/deploy-ui.yml` CI workflow (see
   below) with the `deployment_bucket_name` output so pushes build and
   publish the Angular app for the EC2 instances to pick up.

## Usage: standalone stack

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

## Deploying the Angular build to EC2

The `compute` module can render a built-in `user_data` script
(`modules/compute/templates/user_data.sh.tpl`, enabled via
`enable_nginx_deployment = true`) that installs nginx and syncs the
Angular build from an S3 bucket into the web root on boot and every 5
minutes thereafter via cron. `.github/workflows/deploy-ui.yml` builds the
app with `npm ci && npm run build -- --configuration production` and
publishes `dist/insurance-portal/browser` to that bucket on every push to
`main`, so new deployments are picked up automatically without
re-provisioning instances.

## Wiring the API URL

Before building the production bundle, set `apiBaseUrl` in
`src/environments/environment.ts` to the backend's ALB DNS name (or a
Route 53/CloudFront domain in front of it), and ensure CORS is enabled on
the backend for the UI's origin.

## Notes

- The database password (`environments/dev` only) is required and must be
  supplied via `TF_VAR_db_password` or a secrets manager — it is
  intentionally not set in `terraform.tfvars.example`.
- Additional environments (e.g. `staging`, `prod`) can be added by copying
  the `shared` or `dev` directory and adjusting `backend.tf` (state `key`)
  and `terraform.tfvars`.
