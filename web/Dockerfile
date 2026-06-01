FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

# Bake the public API origin into the client bundle (browser → api.domain.com).
# RSC server-side fetches use API_INTERNAL_URL at runtime instead (see auth.js).
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN bun run build

EXPOSE 4173

# vite preview serves the RSC build; host/port come from vite.config.js (PORT env).
CMD ["bun", "run", "preview"]
