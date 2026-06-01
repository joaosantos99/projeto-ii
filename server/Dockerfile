FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3000

# Run migrations (prod config reads DATABASE_URL), then boot the API.
CMD ["sh", "-c", "bun run db:migrate && bun src/server.js"]
