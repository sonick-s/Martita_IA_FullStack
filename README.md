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


Tecnica par levantar el proyecto
    Docker 
    - Mysql
     La primera vez se copia el init.sql y se crea la base de datos y es persistente
    - Backend 
     Se monta y se conecta en docker
    - Flowise 
     Monta en un docker persistente se carga manualmente el flujo para la version del flowise configuarar pa cargar credenciales manualmente.
    - Frontend 
     Se conecta automaticamente
    -Chat enbebible
     (probar en una pagina web externa) configurar a mano 


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