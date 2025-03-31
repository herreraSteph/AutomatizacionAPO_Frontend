# Etapa 1: Construcción de la aplicación
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build

# Etapa 2: Servidor para producción
FROM caddy:2.7.6-alpine
COPY --from=builder /app/dist /srv
EXPOSE 80
CMD ["caddy", "file-server", "--root", "/srv", "--listen", ":80"]