# Load tests (JMeter)

Apache JMeter test plan for the Projeto II API.

The plan ([`api-load-test.jmx`](./api-load-test.jmx)) logs in once per virtual
user, extracts the session token, then drives a mix of public and authenticated
endpoints:

| Sampler | Auth | Notes |
|---|---|---|
| `POST /api/auth/login` | – | Once per thread. Extracts `$.token`, asserts 200. |
| `GET /api/health` | – | Asserts 200. |
| `GET /api/alerts/summary` | – | Public. |
| `GET /api/auth/me` | Bearer | Uses extracted token. |
| `GET /api/alerts` | Bearer | Uses extracted token. |

## Prerequisites

- JMeter 5.6+ (`brew install jmeter`)
- The API running and reachable (dev runs on `http://localhost:4040`, per `.env`)
- A valid user — seeded users use password `123456789a`. Get an email with:
  ```bash
  docker compose exec -T mysql mysql -umysql_user -pmysql_password projeto_ii \
    -N -e "SELECT email FROM users LIMIT 1;"
  ```

## Parameters

All overridable with `-Jkey=value`:

| Property | Default | Meaning |
|---|---|---|
| `protocol` | `http` | http/https |
| `host` | `localhost` | API host |
| `port` | `3000` | API port (dev `.env` uses `4040`) |
| `email` | `admin@cm-viladoconde.pt` | Login email |
| `password` | `password123` | Login password |
| `threads` | `20` | Concurrent users |
| `rampup` | `10` | Ramp-up seconds |
| `loops` | `10` | Iterations per user |

## Run (non-GUI — use this for real load)

```bash
jmeter -n -t load-tests/api-load-test.jmx \
  -Jhost=localhost -Jport=4040 \
  -Jemail=you@example.com -Jpassword=123456789a \
  -Jthreads=50 -Jrampup=15 -Jloops=20 \
  -l load-tests/results.jtl \
  -e -o load-tests/report
```

`-l` writes raw results; `-e -o <dir>` generates an HTML dashboard. Open
`load-tests/report/index.html`.

Or via Makefile (from repo root, defaults to port 4040):

```bash
make load-test                      # defaults
make load-test THREADS=50 LOOPS=20  # override
```

## Run (GUI — for editing the plan only)

```bash
jmeter -t load-tests/api-load-test.jmx
```

> Results (`*.jtl`), `jmeter.log`, and the generated `report/` are git-ignored.
