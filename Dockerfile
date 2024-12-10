FROM node:20-alpine AS base

# Шаг 1. Установка пакетов
FROM base AS deps
WORKDIR /app

COPY package*.json ./

RUN npm ci

# Шаг 2. Сборка проекта
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ENV
ENV NEXT_TELEMETRY_DISABLE=1
ENV NODE_ENV=production

RUN npx prisma generate

RUN npm run build

# Шаг 3. Запуск
FROM base AS runner
WORKDIR /app

# ENV
ENV NEXT_TELEMETRY_DISABLE=1
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Устанавливаем права доступа на папки и файлы
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем только нужные для работы приложения файлы
COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma/

# Запускаем процесс от пользователя nextjs
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
