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
- [ ] Calibrar ambientes para desarrollo, produccion , test, con docusaurus y flowise con Docker
- [ ] Dejar fijo la voz
- [ ] Aplicar filtro a la respuesta por voz (quitar asteriscos)
- [ ] Que el audio se detenga al enviar un nuevo mensaje
- [ ] Registrar las preguntas y respuestas del chat (a ser posible de flowise)
- [ ] Guardar los registros de pregunta y respeusta desde el flowise en la base de datos
- [ ] Calibrar los pronts.
- [ ] Diseño del chatbot embebido con .gif
- [ ] Asegurar con jwt los servicios de backend
- [ ] Asegurar con jwt los servicios de frontend
- [ ] Asegurar con jwt los servicios de flowise

#### Prompts a analizar.

Primer 
Analice el titulo y la descripcion general y que recuerde el id del tramite que mas se parezca
Segundo
La siguiente respuesta puedes darle mas contexto y sugerirle al final cuales son los requisitos.
Tercer
Despues sugiere los pasos que debe seguir.
Cuarto
Finanmente muestrale el link de los formularios que deberia llenar
Quinto
Si no encuentra informacion en memoria sugierele acercarse a la direccion o departamento que se especifica en el tramite o botar el numero de telefono 