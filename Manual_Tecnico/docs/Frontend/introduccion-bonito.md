# Introducción al Frontend (Bonito)

## Descripción General

El frontend de Martita IA es una aplicación web moderna y elegante construida con React, diseñada para proporcionar una experiencia de usuario excepcional en la interacción con inteligencia artificial conversacional. La interfaz combina funcionalidad avanzada con un diseño atractivo y intuitivo.

## Características Principales

### 1. **Diseño Moderno y Responsivo**
- Interfaz limpia y minimalista
- Diseño adaptativo para todos los dispositivos
- Paleta de colores moderna y accesible
- Animaciones suaves y transiciones elegantes

### 2. **Experiencia de Usuario Excepcional**
- Navegación intuitiva y fluida
- Feedback visual inmediato
- Estados de carga elegantes
- Manejo de errores amigable

### 3. **Funcionalidades Avanzadas**
- Chat en tiempo real
- Historial de conversaciones
- Configuración de modelos de IA
- Analytics y métricas visuales

### 4. **Tecnologías Modernas**
- React 18 con hooks
- TypeScript para type safety
- Tailwind CSS para estilos
- Framer Motion para animaciones

## Tecnologías Utilizadas

### Framework Principal
- **React 18**: Biblioteca de interfaz de usuario
- **TypeScript**: Tipado estático para mayor robustez
- **Vite**: Build tool rápido y moderno

### Estilos y UI
- **Tailwind CSS**: Framework de utilidades CSS
- **Headless UI**: Componentes accesibles
- **Framer Motion**: Animaciones y transiciones
- **Lucide React**: Iconografía moderna

### Estado y Datos
- **Zustand**: Gestión de estado ligera
- **React Query**: Caché y sincronización de datos
- **Axios**: Cliente HTTP

### Herramientas de Desarrollo
- **ESLint**: Linting de código
- **Prettier**: Formateo automático
- **Husky**: Git hooks
- **Storybook**: Documentación de componentes

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de UI básicos
│   ├── chat/           # Componentes del chat
│   ├── layout/         # Componentes de layout
│   └── forms/          # Componentes de formularios
├── pages/              # Páginas de la aplicación
├── hooks/              # Custom hooks
├── services/           # Servicios de API
├── stores/             # Estado global
├── types/              # Definiciones de tipos
├── utils/              # Utilidades
└── styles/             # Estilos globales
```

## Componentes Principales

### 1. **Chat Interface**
```tsx
// Componente principal del chat
<ChatInterface>
  <ChatHeader />
  <MessageList />
  <MessageInput />
  <ChatSidebar />
</ChatInterface>
```

### 2. **Conversation List**
```tsx
// Lista de conversaciones
<ConversationList>
  <ConversationItem />
  <ConversationItem />
  <NewConversationButton />
</ConversationList>
```

### 3. **Settings Panel**
```tsx
// Panel de configuración
<SettingsPanel>
  <ModelSelector />
  <ThemeToggle />
  <UserProfile />
</SettingsPanel>
```

## Paleta de Colores

### Colores Principales
```css
/* Colores de marca */
--primary: #6366f1;      /* Índigo */
--primary-dark: #4f46e5;
--secondary: #8b5cf6;    /* Violeta */
--accent: #06b6d4;       /* Cian */

/* Colores neutros */
--background: #ffffff;
--surface: #f8fafc;
--border: #e2e8f0;
--text: #1e293b;
--text-muted: #64748b;
```

### Modo Oscuro
```css
/* Tema oscuro */
--background-dark: #0f172a;
--surface-dark: #1e293b;
--border-dark: #334155;
--text-dark: #f1f5f9;
--text-muted-dark: #94a3b8;
```

## Tipografía

### Fuentes Utilizadas
- **Inter**: Fuente principal para texto
- **JetBrains Mono**: Fuente monoespaciada para código
- **Material Icons**: Iconografía

### Escala de Tipografía
```css
/* Tamaños de fuente */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
```

## Animaciones y Transiciones

### Transiciones Suaves
```css
/* Transiciones estándar */
.transition-standard {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-slow {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Animaciones de Entrada
```tsx
// Animación de entrada con Framer Motion
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  <MessageBubble />
</motion.div>
```

## Responsive Design

### Breakpoints
```css
/* Breakpoints de Tailwind */
sm: 640px   /* Móviles grandes */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Pantallas grandes */
```

### Layout Adaptativo
```tsx
// Layout que se adapta al tamaño de pantalla
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  <aside className="lg:col-span-1">
    <ConversationList />
  </aside>
  <main className="lg:col-span-3">
    <ChatInterface />
  </main>
</div>
```

## Accesibilidad

### Características de Accesibilidad
- Navegación por teclado completa
- Soporte para lectores de pantalla
- Contraste de colores adecuado
- Textos alternativos en imágenes
- ARIA labels en elementos interactivos

### Ejemplo de Componente Accesible
```tsx
<button
  aria-label="Enviar mensaje"
  aria-describedby="message-input"
  className="btn-primary"
  onClick={handleSend}
>
  <SendIcon aria-hidden="true" />
  Enviar
</button>
```

## Performance

### Optimizaciones Implementadas
- **Code Splitting**: Carga diferida de componentes
- **Lazy Loading**: Carga de imágenes bajo demanda
- **Memoización**: React.memo para componentes pesados
- **Virtualización**: Para listas largas
- **Service Worker**: Caché offline

### Métricas de Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## Estados de la Aplicación

### Estados de Carga
```tsx
// Estados de carga elegantes
{isLoading && (
  <div className="flex items-center justify-center p-8">
    <Spinner className="w-8 h-8 text-primary" />
    <span className="ml-2">Cargando...</span>
  </div>
)}
```

### Estados de Error
```tsx
// Manejo elegante de errores
{error && (
  <ErrorBoundary>
    <ErrorMessage 
      title="Algo salió mal"
      message={error.message}
      onRetry={handleRetry}
    />
  </ErrorBoundary>
)}
```

## Temas y Personalización

### Sistema de Temas
```tsx
// Contexto de tema
const ThemeContext = createContext();

// Hook personalizado
const useTheme = () => {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return { theme, toggleTheme };
};
```

### Variables CSS Dinámicas
```css
/* Variables que cambian con el tema */
:root[data-theme="dark"] {
  --background: var(--background-dark);
  --text: var(--text-dark);
}
```

## Componentes de UI

### Botones
```tsx
// Sistema de botones consistente
<Button variant="primary" size="md">
  Enviar Mensaje
</Button>

<Button variant="secondary" size="sm">
  Cancelar
</Button>
```

### Inputs
```tsx
// Inputs con validación visual
<Input
  label="Mensaje"
  placeholder="Escribe tu mensaje..."
  error={errors.message}
  required
/>
```

### Modales
```tsx
// Modales accesibles
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Nueva Conversación"
>
  <ModalContent>
    <ConversationForm />
  </ModalContent>
</Modal>
```

## Testing

### Testing de Componentes
```tsx
// Tests con React Testing Library
import { render, screen } from '@testing-library/react';
import { ChatInterface } from './ChatInterface';

test('renders chat interface', () => {
  render(<ChatInterface />);
  expect(screen.getByRole('textbox')).toBeInTheDocument();
});
```

### Testing de Integración
```tsx
// Tests de flujos completos
test('user can send a message', async () => {
  render(<ChatInterface />);
  
  const input = screen.getByRole('textbox');
  const sendButton = screen.getByRole('button', { name: /enviar/i });
  
  fireEvent.change(input, { target: { value: 'Hola' } });
  fireEvent.click(sendButton);
  
  await waitFor(() => {
    expect(screen.getByText('Hola')).toBeInTheDocument();
  });
});
```

## Deployment

### Build de Producción
```bash
# Build optimizado
npm run build

# Preview del build
npm run preview
```

### Configuración de Variables
```env
# Variables de entorno
VITE_API_URL=https://api.martita-ia.com
VITE_APP_NAME=Martita IA
VITE_APP_VERSION=1.0.0
```

## Próximos Pasos

Después de familiarizarte con la introducción:

1. Revisar la **Arquitectura** del frontend
2. Explorar los **Componentes** específicos
3. Entender las **Rutas** y navegación
4. Consultar el **Material de Apoyo**

## Recursos Adicionales

- [Documentación de React](https://react.dev/)
- [Guía de Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Mejores prácticas de UX](https://www.nngroup.com/articles/) 