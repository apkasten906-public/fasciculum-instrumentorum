FROM node:25-bookworm

ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=${PNPM_HOME}:${PATH}

# Install additional tools
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    git \
    curl \
    wget \
    sudo \
    vim \
    nano \
    postgresql-client \
    redis-tools \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN mkdir -p "${PNPM_HOME}" && npm install -g pnpm@8.15.0

# Install common global packages
RUN pnpm add -g \
    typescript \
    ts-node \
    nodemon \
    pm2

# Set up working directory
WORKDIR /workspace

# Create non-root user
ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN echo "${USERNAME} ALL=(root) NOPASSWD:ALL" > "/etc/sudoers.d/${USERNAME}" \
    && chmod 0440 "/etc/sudoers.d/${USERNAME}"

# Switch to non-root user
USER $USERNAME

# Configure git safe directory for the non-root user
RUN git config --global --add safe.directory /workspace

# Set default shell
SHELL ["/bin/bash", "-c"]
