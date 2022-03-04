DOCKER ?= docker
KUBECTL ?= kubectl

# Docker related commands
up: build-app
	$(DOCKER) run -dp 8080:8080 synpulse-test

build: 
	$(DOCKER) build -t synpulse-test .

# Kubernetes related commands
kube-build:
	set -euo pipefail
	eval $(minikube docker-env)
	make build

kube-deploy: 
	kube-build
	$(KUBECTL) apply -f deploy/

kube-delete:
	$(KUBECTL) delete -f deploy/

.PHONY: up, build, kube-build, kube-deploy, kube-delete
