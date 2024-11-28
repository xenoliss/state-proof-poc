FROM mcr.microsoft.com/devcontainers/base:jammy

USER vscode

RUN sudo apt-get update

RUN curl -fsSL https://bun.sh/install | bash
RUN curl -L https://foundry.paradigm.xyz | bash

SHELL ["/bin/bash", "--login", "-i", "-c"]
RUN foundryup
