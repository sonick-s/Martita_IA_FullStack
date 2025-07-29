# Martita IA

## Levantar el proyecto en diferentes ambiente

```bash
docker-compose -f docker-compose.dev.yml up --build --force-recreate # para desarrollo
docker-compose -f docker-compose.test.yml up --build # para pruebas
docker-compose -f docker-compose.yml up --build # para producción

```
TAREAS
- [ ] Dejar fijo una version de flujo del flowise que funcione con el archivo json