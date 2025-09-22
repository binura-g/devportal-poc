# PE Dashboard Routes

This module's routes are designed to be dynamically loaded when the module is activated.

## Route Structure

- `/` - Main PE Dashboard (index.tsx)
- `/metrics` - Detailed metrics view  
- `/modules` - Module management
- `/modules/:moduleId` - Individual module details
- `/settings` - PE Dashboard settings

## Dynamic Route Loading

These routes are registered with the main application router when:
1. The module is activated
2. The user is in platform-engineering perspective

## Example Implementation

```typescript
// In main app route loader
async function loadModuleRoutes(moduleId: string) {
  const module = await import(`@/modules/${moduleId}`)
  return module.routes
}
```