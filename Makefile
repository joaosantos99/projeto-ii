.PHONY: setup up down reset migrate seed dev dev-server dev-web

setup: up migrate seed

up:
	docker compose up -d
	@echo "Waiting for MySQL to be ready..."
	@until docker compose exec mysql mysqladmin ping -h 127.0.0.1 --silent; do sleep 1; done

down:
	docker compose down

reset:
	docker compose down
	rm -rf .data
	$(MAKE) setup

migrate:
	cd server && bun run db:migrate

seed:
	cd server && bun run seed.js

dev: dev-server dev-web

dev-server:
	cd server && bun run dev &

dev-web:
	cd web && bun run dev
