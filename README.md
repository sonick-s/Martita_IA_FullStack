# Martita IA

## Documentacion con Docusaurus
La documentacion tecnica (Manual Tecnico y de Usuario) solo se levantara cuando usen el contenedor de desarrollo, mientras que el (Manual de Usuario) se levantara solo en el contenedor de test y produccion.



## Proceso para levantar el proyecto 
-Clona el repositorio
-Configura las variables de entorno en el archivo .env

Usa docker en sus diferentes ambientes para levantarlos
```bash
docker-compose -f docker-compose.dev.yml up --build --force-recreate -d # para desarrollo
docker-compose -f docker-compose.test.yml up --build -d # para pruebas
docker-compose -f docker-compose.yml up --build -d # para producción

```
!!! caution "CUIDADO: Flowise🤔"
    Si el flowise se levanta pero no funciona al cargar el chatflow, debes crear el flujo manualmente y configurarlo , no olvides los prompts.
---
Flowise
- Accede a la url http://localhost:3000
- Inicia sesión con el usuario admin y la contraséna admin
- Importa el archivo Martita_Chatflow.json


TAREAS
Omar
- [ ] Calibrar ambientes para desarrollo, produccion , test, con docusaurus y flowise con Docker
- [ ] Registrar las preguntas y respuestas del chat (a ser posible de flowise)
- [*] Calibrar los pronts.
- [ ] Asegurar con jwt los servicios de backend
- [ ] Asegurar con jwt los servicios de frontend
- [ ] Asegurar con jwt los servicios de flowise
- [ ] Completar los manuales tecnico y de usuario

Jean
- [ ] Implementar la pagina en php igualita a la del Municipio o clonar XD y con el docker levantado y le implementar el servicio martitachatbot.js
- [ ] Dejar fijo la voz
- [ ] Aplicar filtro a la respuesta por voz (quitar asteriscos)
- [ ] Que el audio se detenga al enviar un nuevo mensaje
- [ ] Diseño del chatbot embebido con .gif
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