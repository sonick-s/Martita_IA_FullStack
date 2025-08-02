# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Guion a Implementar
- [ ] Paginas Tutorial
- [ ] Blog (Creadores)
- [ ] Footer (Creadores)

## Martita IA
- [*] Presentacion
- [*] Problemas que resuelve
- [*] Componentes Tecnicos (Tecnologias sobre las que fueron Desarrolladas)
- [*] Arquitectura Del Sistema
- [*] Funcionalidades Principales
- [ ] Material de Apoyo

## Installation y Despliegue
- [*] Instalacion Manual 
- [*] Instalacion Con docker
- [*] Despliegue Con Docker

## Base de Datos
- [*] Introduccion
- [*] Componentes

## Api Rest
- [*] Introduccion (Swagger)
- [*] Arquitectura
- [*] Endpoints
- [*] Seguridad

## Frontend
- [ ] Introduccion (Bonito)
- [ ] Arquitectura
- [ ] Componentes
- [ ] Rutas
- [ ] Servicios
- [ ] Funcionalidades
- [ ] Material de Apoyo

## Flowise
- [ ] Introduccion
- [ ] Configuracion
- [ ] Credenciales
- [ ] Flujos
- [ ] Material de Apoyo

## Docusaurus
- [ ] Documentacion
- [ ] Material de Apoyo


```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

