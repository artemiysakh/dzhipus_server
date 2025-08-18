FROM node:18-alpine

WORKDIR /app

# Копируем только package.json для кэширования
COPY --chown=node:node package*.json ./

# Устанавливаем зависимости с очисткой кэша
RUN npm cache clean --force && \
    rm -rf node_modules && \
    npm ci --no-cache

# Копируем остальные файлы
COPY --chown=node:node . .

# Переключаемся на пользователя 'node'
USER node

CMD ["npm", "start"]