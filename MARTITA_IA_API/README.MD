# API PARA LA APLICACIÓN MARTITA_IA

Guía para la instalación, configuración y ejecución de la API del proyecto **MARTITA_IA**.

---

## 🚀 Instalación y Ejecución de la API

### 1. Crear el entorno virtual

```bash
python -m venv venv # Crear entorno virtual
source venv/Scripts/activate # activar el entorno virtual En Windows
source venv/bin/activate # activar el entorno virtual En Unix/macOS

pip install -r requirements.txt # Instalar dependencias
uvicorn app.main:app --reload # Lanzar la API
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload # Lanzar la API para flowise
```
Esto ejecutará la API en modo desarrollo en `http://127.0.0.1:8000`.

### 2. Seguridad
se usara jwt para la autenticacion de los usuarios

### 3. Docker

```bash
# Construir la imagen
docker build --no-cache -t martita_ia_api .

# Ejecutar el contenedor
docker run -d -p 8000:8000 --env-file .env --name martita_api_container martita_ia_api
```

## ⚠️ Tareas urgentes

**¡IMPORTANTE!**  
Estas tareas deben completarse hasta el martes , jueves tenemos presentacion final

schemas
- [ ] hacer que todos los campos puedan pasar valores opciones

Usuarios
- [ ] Falta fecha al registrarse y estado
- [ ] 

Reglas del Bot
- [ ] 

Tramites
- [ ] Falta fecha
