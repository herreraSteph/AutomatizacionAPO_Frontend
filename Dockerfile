FROM node:18-alpine

WORKDIR /app

# Copia archivos de dependencias primero (caché eficiente)
COPY package.json package-lock.json ./

# Instala con --legacy-peer-deps para evitar errores
RUN npm install --legacy-peer-deps

# Copia el resto del proyecto
COPY . .

# Build de producción
RUN npm run build

# Puerto que usa 'vite preview' (ajusta si es necesario)
EXPOSE 10000

# Comando para Render
CMD ["npm", "run", "preview"]