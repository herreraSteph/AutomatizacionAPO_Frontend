# Usa una imagen base de Node.js para construir la aplicación
FROM node:18 as build

WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install --legacy-peer-deps

# Copia todo el código fuente al contenedor
COPY . .

# Ejecuta la construcción
RUN npm run build

# Verifica la salida generada por Vite
RUN ls -la /app/dist

# Usa una imagen ligera de Nginx para servir los archivos
FROM nginx:alpine

# Copia los archivos generados en la etapa de construcción a Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Comando para ejecutar el servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
