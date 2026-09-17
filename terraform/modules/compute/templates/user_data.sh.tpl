#!/bin/bash
# Installs nginx and serves the Angular build published to S3 by the
# ui-repo CI workflow (.github/workflows/deploy-ui.yml).
#
# The Angular build artifact is expected at:
#   s3://${deployment_bucket}/${deployment_key_prefix}/
#
# On boot, and every 5 minutes thereafter via cron, the latest build is
# synced from S3 into nginx's web root so new deployments are picked up
# without having to replace the instance.
set -euo pipefail

dnf install -y nginx

mkdir -p /usr/share/nginx/html
cat > /usr/local/bin/sync-ui-build.sh <<'SCRIPT'
#!/bin/bash
set -euo pipefail
aws s3 sync "s3://${deployment_bucket}/${deployment_key_prefix}/" /usr/share/nginx/html --delete
SCRIPT
chmod +x /usr/local/bin/sync-ui-build.sh

# Initial sync (best effort - bucket may be empty on first boot)
/usr/local/bin/sync-ui-build.sh || true

# Refresh the deployed build periodically so new CI builds are served
# without needing to re-provision the instance.
echo "*/5 * * * * root /usr/local/bin/sync-ui-build.sh >> /var/log/sync-ui-build.log 2>&1" > /etc/cron.d/sync-ui-build

systemctl enable nginx
systemctl start nginx
