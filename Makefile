.PHONY: setup up down reset migrate seed dev dev-server dev-web load-test prod prod-down prod-logs

setup: up migrate seed

# ── Production (Hetzner single server) ──────────────────
# Reads .env. Builds + boots mysql, server, web, caddy. Migrations run on server boot.
prod:
	docker compose -f docker-compose.prod.yml up -d --build --remove-orphans

prod-down:
	docker compose -f docker-compose.prod.yml down

prod-logs:
	docker compose -f docker-compose.prod.yml logs -f

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

# Load test the API with JMeter. Override e.g. make load-test THREADS=50 LOOPS=20
HOST ?= localhost
PORT ?= 4040
THREADS ?= 20
RAMPUP ?= 10
LOOPS ?= 10
load-test:
	rm -rf load-tests/report load-tests/results.jtl
	jmeter -n -t load-tests/api-load-test.jmx \
		-Jhost=$(HOST) -Jport=$(PORT) \
		-Jthreads=$(THREADS) -Jrampup=$(RAMPUP) -Jloops=$(LOOPS) \
		-l load-tests/results.jtl -e -o load-tests/report
	@echo "Report: load-tests/report/index.html"
