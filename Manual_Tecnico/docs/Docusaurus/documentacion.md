# Documentación de Docusaurus

## Descripción General

Docusaurus es un generador de sitios web estáticos optimizado para crear sitios de documentación. En Martita IA, utilizamos Docusaurus para crear una documentación completa, moderna y fácil de navegar que cubre todos los aspectos del sistema.

## Características Principales

### 1. **Documentación Moderna**
- Diseño limpio y profesional
- Navegación intuitiva
- Búsqueda en tiempo real
- Soporte para versionado

### 2. **Funcionalidades Avanzadas**
- Markdown y MDX
- Componentes React personalizados
- Temas personalizables
- SEO optimizado

### 3. **Colaboración**
- Control de versiones con Git
- Revisión de cambios
- Comentarios y feedback
- Integración con CI/CD

### 4. **Escalabilidad**
- Estructura modular
- Carga rápida
- Optimización automática
- Soporte para múltiples idiomas

## Estructura del Proyecto

### Directorios Principales

```
Manual_Tecnico/
├── docs/                    # Documentación principal
│   ├── intro.md            # Página de introducción
│   ├── Instalacion y Despliegue/
│   ├── Base de Datos/
│   ├── Api Rest/
│   ├── Frontend/
│   ├── Flowise/
│   └── Docusaurus/
├── blog/                   # Blog del proyecto
├── src/                    # Código fuente
│   ├── components/         # Componentes React
│   ├── css/               # Estilos personalizados
│   └── pages/             # Páginas adicionales
├── static/                 # Archivos estáticos
├── docusaurus.config.js    # Configuración principal
├── sidebars.js            # Configuración de navegación
└── package.json           # Dependencias
```

### Configuración Principal

```javascript
// docusaurus.config.js
module.exports = {
  title: 'Martita IA - Manual Técnico',
  tagline: 'Documentación completa del sistema de IA conversacional',
  url: 'https://martita-ia.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'martita-ia',
  projectName: 'manual-tecnico',

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/martita-ia/manual-tecnico/edit/main/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/martita-ia/manual-tecnico/edit/main/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Martita IA',
      logo: {
        alt: 'Martita IA Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentación',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/martita-ia/manual-tecnico',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentación',
          items: [
            {
              label: 'Introducción',
              to: '/docs/intro',
            },
            {
              label: 'Instalación',
              to: '/docs/Instalacion y Despliegue/instalacion-manual',
            },
          ],
        },
        {
          title: 'Comunidad',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/martita-ia',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/martita-ia',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Martita IA. Built with Docusaurus.`,
    },
  },
};
```

## Configuración de Navegación

### Sidebars.js

```javascript
// sidebars.js
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Introducción',
      items: ['intro'],
    },
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
```

## Estilos Personalizados

### CSS Personalizado

```css
/* src/css/custom.css */
:root {
  --ifm-color-primary: #6366f1;
  --ifm-color-primary-dark: #4f46e5;
  --ifm-color-primary-darker: #4338ca;
  --ifm-color-primary-darkest: #3730a3;
  --ifm-color-primary-light: #818cf8;
  --ifm-color-primary-lighter: #a5b4fc;
  --ifm-color-primary-lightest: #c7d2fe;
  --ifm-code-font-size: 95%;
  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.1);
}

[data-theme='dark'] {
  --ifm-color-primary: #818cf8;
  --ifm-color-primary-dark: #6366f1;
  --ifm-color-primary-darker: #4f46e5;
  --ifm-color-primary-darkest: #4338ca;
  --ifm-color-primary-light: #a5b4fc;
  --ifm-color-primary-lighter: #c7d2fe;
  --ifm-color-primary-lightest: #e0e7ff;
  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.3);
}

/* Estilos personalizados para componentes */
.custom-card {
  border: 1px solid var(--ifm-color-emphasis-300);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  background: var(--ifm-background-color);
  transition: all 0.2s ease;
}

.custom-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Estilos para bloques de código */
.prism-code {
  font-size: 0.875rem;
  line-height: 1.5;
}

/* Estilos para tablas */
table {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
}

th, td {
  border: 1px solid var(--ifm-color-emphasis-300);
  padding: 0.75rem;
  text-align: left;
}

th {
  background-color: var(--ifm-color-emphasis-100);
  font-weight: 600;
}
```

## Componentes Personalizados

### Componente de Advertencia

```jsx
// src/components/Advertencia.js
import React from 'react';
import clsx from 'clsx';
import styles from './Advertencia.module.css';

export default function Advertencia({children, type = 'info'}) {
  return (
    <div className={clsx(styles.advertencia, styles[type])}>
      <div className={styles.icon}>
        {type === 'warning' && '⚠️'}
        {type === 'error' && '❌'}
        {type === 'success' && '✅'}
        {type === 'info' && 'ℹ️'}
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
```

### Estilos del Componente

```css
/* src/components/Advertencia.module.css */
.advertencia {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
  border-left: 4px solid;
}

.info {
  background-color: #eff6ff;
  border-left-color: #3b82f6;
}

.warning {
  background-color: #fffbeb;
  border-left-color: #f59e0b;
}

.error {
  background-color: #fef2f2;
  border-left-color: #ef4444;
}

.success {
  background-color: #f0fdf4;
  border-left-color: #22c55e;
}

.icon {
  margin-right: 0.75rem;
  font-size: 1.25rem;
}

.content {
  flex: 1;
}
```

## Uso de MDX

### Página con Componentes

```mdx
---
title: Configuración Avanzada
description: Configuración avanzada del sistema Martita IA
---

import Advertencia from '@site/src/components/Advertencia';

# Configuración Avanzada

<Advertencia type="warning">
  Esta configuración es para usuarios avanzados. Asegúrate de entender cada paso antes de proceder.
</Advertencia>

## Variables de Entorno

Configura las siguientes variables en tu archivo `.env`:

```bash
# Configuración de base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=martita_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña_segura

# Configuración de la API
API_PORT=3000
API_SECRET=tu_secreto_aqui

# Configuración de Flowise
FLOWISE_URL=http://localhost:3000
FLOWISE_API_KEY=tu_api_key_aqui
```

<Advertencia type="info">
  Recuerda cambiar las contraseñas por defecto por seguridad.
</Advertencia>
```

## Plugins y Extensiones

### Plugin de Búsqueda

```javascript
// docusaurus.config.js
module.exports = {
  // ... configuración existente
  
  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en', 'zh'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        searchBarPosition: 'right',
      },
    ],
  ],
};
```

### Plugin de Analytics

```javascript
// docusaurus.config.js
module.exports = {
  // ... configuración existente
  
  plugins: [
    [
      '@docusaurus/plugin-google-analytics',
      {
        trackingID: 'G-XXXXXXXXXX',
      },
    ],
  ],
};
```

## Comandos de Desarrollo

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run start

# Construir para producción
npm run build

# Servir build localmente
npm run serve
```

### Scripts Disponibles

```json
{
  "scripts": {
    "docusaurus": "docusaurus",
    "start": "docusaurus start",
    "build": "docusaurus build",
    "swizzle": "docusaurus swizzle",
    "deploy": "docusaurus deploy",
    "clear": "docusaurus clear",
    "serve": "docusaurus serve",
    "write-translations": "docusaurus write-translations",
    "write-heading-ids": "docusaurus write-heading-ids",
    "typecheck": "tsc"
  }
}
```

## Deployment

### GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

### Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## SEO y Metadatos

### Configuración de SEO

```javascript
// docusaurus.config.js
module.exports = {
  // ... configuración existente
  
  titleDelimiter: '|',
  url: 'https://martita-ia.com',
  baseUrl: '/',
  
  // Configuración de SEO
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  
  // Configuración de i18n
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
  },
};
```

### Metadatos por Página

```mdx
---
title: Instalación Manual
description: Guía paso a paso para instalar Martita IA manualmente
keywords: [instalación, manual, martita, ia, setup]
image: /img/installation-guide.png
---

# Instalación Manual

Contenido de la página...
```

## Personalización de Temas

### Tema Personalizado

```jsx
// src/theme/Footer/index.js
import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

function Footer() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  const {themeConfig = {}} = siteConfig;
  const {footer} = themeConfig;

  const {copyright, links = []} = footer || {};

  const logoUrl = useBaseUrl(siteConfig.footer?.logo?.href);

  if (!footer) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col col--6">
            <div className="footer__logo">
              {logoUrl && (
                <img className="footer__logo" src={logoUrl} alt={siteConfig.title} />
              )}
            </div>
            <div className="footer__copyright">{copyright}</div>
          </div>
          <div className="col col--6">
            <div className="footer__links">
              {links.map((linkItem, i) => (
                <div key={i} className="footer__col">
                  {linkItem.title != null && (
                    <h4 className="footer__colTitle">{linkItem.title}</h4>
                  )}
                  {linkItem.items != null && (
                    <ul className="footer__items">
                      {linkItem.items.map((item, j) => (
                        <li key={j} className="footer__item">
                          <Link to={item.href}>{item.label}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
```

## Próximos Pasos

Después de familiarizarte con la documentación:

1. Revisar el **Material de Apoyo** para recursos adicionales
2. Explorar las **Mejores Prácticas** de documentación
3. Contribuir a la **Mejora** de la documentación
4. Participar en la **Comunidad** de desarrolladores

## Recursos Adicionales

- [Documentación oficial de Docusaurus](https://docusaurus.io/docs)
- [Guía de MDX](https://mdxjs.com/)
- [Mejores prácticas de documentación](https://www.writethedocs.org/)
- [Herramientas de documentación](https://www.docusaurus.io/showcase) 