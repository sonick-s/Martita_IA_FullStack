// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Instalación y Despliegue',
      items: [
        'Instalacion y Despliegue/instalacion-manual',
        'Instalacion y Despliegue/instalacion-docker',
        'Instalacion y Despliegue/despliegue-docker',
      ],
    },
    {
      type: 'category',
      label: 'Base de Datos',
      items: [
        'Base de Datos/introduccion',
        'Base de Datos/componentes',
        'Base de Datos/arquitectura',
        'Base de Datos/funcionalidades',
        'Base de Datos/material-apoyo',
      ],
    },
    {
      type: 'category',
      label: 'API REST',
      items: [
        'Api Rest/introduccion-swagger',
        'Api Rest/arquitectura',
        'Api Rest/endpoints',
        'Api Rest/seguridad',
        'Api Rest/funcionalidades',
        'Api Rest/material-apoyo',
      ],
    },
    {
      type: 'category',
      label: 'Frontend',
      items: [
        'Frontend/introduccion-bonito',
        'Frontend/arquitectura',
        'Frontend/componentes',
        'Frontend/rutas',
        'Frontend/servicios',
        'Frontend/funcionalidades',
        'Frontend/material-apoyo',
      ],
    },
    {
      type: 'category',
      label: 'Flowise',
      items: [
        'Flowise/introduccion',
        'Flowise/configuracion',
        'Flowise/credenciales',
        'Flowise/flujos',
        'Flowise/material-apoyo',
      ],
    },
    {
      type: 'category',
      label: 'Docusaurus',
      items: [
        'Docusaurus/documentacion',
        'Docusaurus/material-apoyo',
      ],
    },
  ],
};

module.exports = sidebars;
