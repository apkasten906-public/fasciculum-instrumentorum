#!/bin/bash

set -e

echo "Running post-create setup..."

# Load personal config from .devcontainer/.env if present (gitignored).
# This is the fallback for when host env vars aren't forwarded by Docker Compose.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCAL_ENV="${SCRIPT_DIR}/.env"
if [ -f "${LOCAL_ENV}" ]; then
  echo "Loading personal config from ${LOCAL_ENV}..."
  while IFS='=' read -r key value; do
    # Skip blank lines and comments
    [[ -z "$key" || "$key" == \#* ]] && continue
    # Only import GIT_* vars; strip surrounding quotes if present
    if [[ "$key" =~ ^GIT_ ]]; then
      value="${value%\"}"
      value="${value#\"}"
      value="${value%\'}"
      value="${value#\'}"
      export "$key"="$value"
    fi
  done < "${LOCAL_ENV}"
fi

# Ensure git treats /workspace as safe regardless of ownership
git config --global --add safe.directory /workspace

PNPM_VERSION="${PNPM_VERSION:-10.23.0}"

if ! command -v pnpm >/dev/null 2>&1; then
    echo "Installing pnpm ${PNPM_VERSION}..."
    npm install -g "pnpm@${PNPM_VERSION}"
fi

echo "Using pnpm $(pnpm --version)"

mapfile -t NODE_MODULE_DIRS < <(find . -type d -name node_modules 2>/dev/null)

for dir in "${NODE_MODULE_DIRS[@]}"; do
    if [ ! -w "$dir" ]; then
        echo "$dir is not writable by $(whoami); repairing ownership..."
        if command -v sudo >/dev/null 2>&1; then
            sudo chown -R "$(id -u):$(id -g)" "$dir"
        else
            mv "$dir" "${dir}.root-owned.$(date +%s)"
            mkdir -p "$dir"
        fi
    fi
done

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Prisma client generation is required for backend startup and can be skipped
# when dependency build scripts are gated by pnpm's approve-builds flow.
echo "Generating Prisma client..."
pnpm --filter backend run db:generate

# Set up git hooks
echo "Setting up Git hooks..."
pnpm prepare

# Create .env files from examples (if they exist)
if [ -f ".env.example" ]; then
    echo "Creating .env.development from .env.example..."
    cp .env.example .env.development
fi

# Set git config
echo "Configuring git..."
git config --global core.autocrlf input
git config --global init.defaultBranch main

# Persist identity forwarded from the host (set GIT_AUTHOR_NAME / GIT_AUTHOR_EMAIL
# in your host shell profile once — devcontainer picks them up automatically).
if [ -n "${GIT_AUTHOR_NAME}" ]; then
  git config --global user.name "${GIT_AUTHOR_NAME}"
  echo "  git user.name  = ${GIT_AUTHOR_NAME}"
else
  echo "  WARNING: GIT_AUTHOR_NAME not set on host — git identity not configured."
fi
if [ -n "${GIT_AUTHOR_EMAIL}" ]; then
  git config --global user.email "${GIT_AUTHOR_EMAIL}"
  echo "  git user.email = ${GIT_AUTHOR_EMAIL}"
else
  echo "  WARNING: GIT_AUTHOR_EMAIL not set on host — git identity not configured."
fi

echo "Post-create setup complete!"
echo ""
echo "📚 Next steps:"
echo "  1. Review .env.development and update with your configuration"
echo "  2. Run 'pnpm dev' to start development servers"
echo "  3. Check SETUP.md for detailed instructions"
