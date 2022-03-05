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
	make kube-build
	$(KUBECTL) apply -f deploy/

kube-api-deploy:
	make kube-build
	$(KUBECTL) create -f deploy/api-deployment.yaml
	$(KUBECTL) expose deployment synpulse-test --type="LoadBalancer"
	$(KUBECTL) apply -f https://raw.githubusercontent.com/google/metallb/v0.9.3/manifests/namespace.yaml
	$(KUBECTL) apply -f https://raw.githubusercontent.com/google/metallb/v0.9.3/manifests/metallb.yaml # On the first install only
	$(KUBECTL) create secret generic -n metallb-system memberlist --from-literal=secretkey="$(openssl rand -base64 128)"
	$(KUBECTL) create -f deploy/configmap.yaml

kube-node-deploy:
	$(KUBECTL) create -f deploy/deployment.yaml
	$(KUBECTL) expose deployment synpulse-test-deployment --type="LoadBalancer"
	$(KUBECTL) create -f deploy/configmap.yaml

kube-delete:
	$(KUBECTL) delete -f deploy/deployment.yaml
	$(KUBECTL) delete svc synpulse-test-deployment
	$(KUBECTL) delete -f deploy/configmap.yaml

kube-api-deploy2:
	$(KUBECTL) apply -f deploy2/

kube-delete2:
	$(KUBECTL) delete -f deploy2/

.PHONY: up, build, kube-build, kube-deploy, kube-delete
