# Usa una imagen oficial de Node con la versión que necesites (ajústala)
FROM node:16.20.2-alpine

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de configuración del proyecto
COPY package.json .
COPY package-lock.json .  # o yarn.lock si usas Yarn

# Instala dependencias con legacy-peer-deps (para resolver conflictos)
RUN npm install --legacy-peer-deps

# Copia el resto del proyecto
COPY . .

# Construye la aplicación (ajusta si tu proyecto tiene configuración especial)
RUN npm run build

# Puerto que expone la aplicación (ajusta según tu vite.config.js)
EXPOSE 3000

# Comando para iniciar la aplicación en desarrollo (si prefieres producción, usa 'npm run preview')
CMD ["npm", "run", "dev"]