FROM python:3.11-slim-bullseye AS builder

RUN apt-get update && apt-get install -y git

# Directorio de trabajo
WORKDIR /usr/src/app

# Instalar dependencias de construcción
# Copiar solo requirements.txt primero para aprovechar el caché de Docker
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Instalar PyInstaller para compilar la aplicación
RUN pip install pyinstaller

# Copiar el código fuente de la aplicación
COPY ./app ./app

# Ejecutar PyInstaller para generar el ejecutable
# --onefile: crea un único archivo ejecutable
# --name: define el nombre del archivo de salida
# El punto de entrada es app/main.py
RUN pyinstaller --noconfirm --onefile --name "martita_api" "app/main.py"


# Stage 2: Final - Crea la imagen final y ligera
FROM python:3.11-slim-bullseye

WORKDIR /app

# Copiar el ejecutable compilado desde la etapa "builder"
COPY --from=builder /usr/src/app/dist/martita_api .

# Es recomendable gestionar las variables de entorno fuera de la imagen (ej. en docker-compose.yml)
# Pero si necesitas incluir el archivo .env, puedes descomentar la siguiente línea:
# COPY .env .

# Expone el puerto en el que corre la aplicación.
# Es posible que necesites cambiar este puerto dependiendo de la configuración de tu API.
EXPOSE 8000

# Comando para ejecutar la aplicación
CMD ["./martita_api"]
