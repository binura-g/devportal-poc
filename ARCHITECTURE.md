# Architecture Overview

## Plugin Architecture

The DevPortal follows a plugin-based architecture similar to Backstage, where everything is a plugin that can be dynamically loaded and integrated.

### Core Concepts

1. **Plugin Definition**
   - Each plugin is a self-contained React module
   - Plugins export a manifest with metadata
   - Plugins can register routes, navigation items, and API endpoints

2. **Global Context**
   - Plugins receive a context object with:
     - Global state (Zustand store)
     - API client
     - Event bus
     - Configuration
     - Theme and auth context

3. **Route Registration**
   - Plugins define their routes using TanStack Router
   - Routes are automatically prefixed with the plugin ID
   - Child routes are fully supported

4. **State Management**
   - Global state is managed by Zustand
   - Plugins can subscribe to state changes
   - Plugins can have their own isolated stores

## Example Plugin Structure

```typescript
// Plugin Definition
export const logsPlugin: Plugin = {
  id: 'logs',
  name: 'Logs Plugin',
  version: '1.0.0',
  
  // Initialize with global context
  init: async (context: PluginContext) => {
    const { api, globalState, eventBus } = context;
    
    // Register API endpoints
    api.register('logs', {
      baseURL: '/api/logs',
      headers: {
        'X-Project-Id': globalState.project?.id
      }
    });
    
    // Subscribe to state changes
    globalState.subscribe((state) => {
      // React to project/environment changes
    });
  },
  
  // Define routes
  routes: [
    {
      path: '',
      component: LogsListPage
    },
    {
      path: 'stream',
      component: LogStreamPage
    }
  ],
  
  // Add navigation items
  navigation: {
    main: [
      {
        id: 'logs',
        label: 'Logs',
        icon: 'FileText',
        path: '/logs'
      }
    ]
  }
};
```

## Loading Plugins

### Static Loading (Current)
```typescript
import { logsPlugin } from '@devportal/plugin-logs';

const pluginConfigs = [
  {
    plugin: logsPlugin,
    enabled: true,
    config: { /* plugin-specific config */ }
  }
];
```

### Dynamic Loading (Future)
```typescript
const dynamicPlugin = await import('https://cdn.example.com/plugin.js');
pluginManager.register(dynamicPlugin.default);
```

## State Flow

```
User Action → Component → Zustand Store → Global State Update
                ↓
            Plugin Context → Plugin Components → Re-render
```

## API Layer

- Centralized API client with interceptors
- Automatic auth token injection
- Request/response transformation
- Error handling and retry logic
- Cache management with React Query

## Component Architecture

```
App
├── Providers (Query, Router, Global State)
├── AppLayout
│   ├── TopNav (Project/Component/Environment Selectors)
│   ├── Sidebar (Perspective-based Navigation)
│   └── Main Content
│       └── Plugin Routes
```