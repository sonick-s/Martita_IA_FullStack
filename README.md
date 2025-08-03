# Martita IA

## Documentacion con Docusaurus
La documentacion tecnica (Manual Tecnico y de Usuario) solo se levantara cuando usen el contenedor de desarrollo, mientras que el (Manual de Usuario) se levantara solo en el contenedor de test y produccion.



## Levantar el proyecto en diferentes ambiente

```bash
docker-compose -f docker-compose.dev.yml up --build --force-recreate # para desarrollo
docker-compose -f docker-compose.test.yml up --build # para pruebas
docker-compose -f docker-compose.yml up --build # para producción

```
TAREAS
- [ ] Dejar fijo una version de flujo del flowise que funcione con el archivo json
- [ ] Calibrar ambientes para desarrollo, produccion , test, con docusaurus y flowise
- [ ] Terminar tesis con normas apa y anexos , incluir docusaurus en marco teorico 