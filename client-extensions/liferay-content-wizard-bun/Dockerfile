FROM oven/bun:latest

COPY package.json ./
COPY src ./src 

RUN bun install

CMD ["bun", "src/http/server.ts"]