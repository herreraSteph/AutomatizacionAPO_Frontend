# Usa una imagen base de Node.js para construir la aplicación
FROM node:18 as build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos y construye la aplicación
COPY . .
RUN npm run build

# Usa una imagen ligera de Nginx para servir los archivos
FROM nginx:alpine

# Copia los archivos de la carpeta build al directorio de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exponemos el puerto que usa Nginx
EXPOSE 80

# Comando para ejecutar el servidor de Nginx
CMD ["nginx", "-g", "daemon off;"]