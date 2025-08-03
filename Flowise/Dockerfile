# Usar una versión específica de Flowise para asegurar la consistencia del entorno.
# La versión 3.0.4 es la más reciente confirmada.
FROM flowiseai/flowise:3.0.4

# Copiar el chatflow predefinido a la carpeta de chatflows de Flowise dentro del contenedor.
# Esto asegura que el chatflow esté disponible automáticamente al iniciar Flowise.
COPY ./flows/martita_ia_chatflow.json /root/.flowise/chatflows/martita_ia_chatflow.json

# La imagen base de Flowise ya se encarga de configurar el directorio de trabajo,
# exponer el puerto por defecto (3000) y definir el comando de inicio.
# La configuración específica (variables de entorno, volúmenes, puertos) 
# se gestionará a través de docker-compose.
