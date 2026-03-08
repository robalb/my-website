# Makefile for deploying a project with docker compose

# Configurable variables
PROJECT_FOLDER ?= blog-halb
REMOTE_HOST    ?= vps
REMOTE_PATH    ?= ~/$(PROJECT_FOLDER)

# Default target
deploy: sync up

# Sync project folder to VPS
sync:
	rsync -Pavz ./$(PROJECT_FOLDER)/ $(REMOTE_HOST):$(REMOTE_PATH)/

# Run docker compose remotely. If already up, up will update the service
up:
	ssh $(REMOTE_HOST) "cd $(REMOTE_PATH) && docker compose up -d"
down:
	ssh $(REMOTE_HOST) "cd $(REMOTE_PATH) && docker compose down"


