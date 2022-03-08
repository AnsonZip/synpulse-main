DOCKER ?= docker
KUBECTL ?= kubectl

# Docker related commands
up: 
	make build
	$(DOCKER) run -dp 8080:8080 nodeserver

build: 
	$(DOCKER) build -t nodeserver .

# Kubernetes related commands
kube-build:
	set -euo pipefail
	eval $(minikube docker-env)
	make build

kube-deploy:
	$(KUBECTL) apply -f deploy/
	minikube service --url test-server

kube-full-deploy:
	make kube-build
	make kube-deploy

kube-delete:
	$(KUBECTL) delete -f deploy/
	

.PHONY: up, build, kube-build, kube-deploy, kube-delete
