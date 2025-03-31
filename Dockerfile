# Usa una imagen base de Node.js para construir la aplicación
FROM node:18 as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# Si la carpeta de salida es dist en vez de build
RUN ls -la /app/dist  # Para verificar si existe

# Usa una imagen ligera de Nginx para servir los archivos
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist .  # Cambia build por dist si es necesario

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
