// Module configuration
export const moduleConfig = {
  id: 'components',
  name: 'Components',
  description: 'Component catalog and management',
  version: '1.0.0',
  
  // Module is available for both perspectives
  perspectives: ['development', 'platform-engineering'],
  
  // Module initialization
  init: async () => {
    console.log('Components module initialized')
  },
  
  // Module cleanup
  destroy: async () => {
    console.log('Components module destroyed')
  }
}

// Export module components
export { ComponentList } from './pages/ComponentList'
export { CreateComponent } from './pages/CreateComponent'