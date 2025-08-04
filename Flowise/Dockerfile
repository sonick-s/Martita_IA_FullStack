# Usar una versión específica de Flowise para asegurar la consistencia del entorno.
# La versión 3.0.4 es la más reciente confirmada.
FROM flowiseai/flowise:3.0.4

# Copiar el chatflow predefinido a la carpeta de chatflows de Flowise dentro del contenedor.
# Esto asegura que el chatflow esté disponible automáticamente al iniciar Flowise.
COPY ./.flowise /root/.flowise

# La imagen base de Flowise ya se encarga de configurar el directorio de trabajo,
# exponer el puerto por defecto (3000) y definir el comando de inicio.
# La configuración específica (variables de entorno, volúmenes, puertos) 
# se gestionará a través de docker-compose.

#docker build -t flowise-app .
#docker run -p 3000:3000 flowise-app
