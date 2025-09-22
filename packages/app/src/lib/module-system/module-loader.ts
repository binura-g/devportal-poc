/**
 * Module loader for dynamic loading of third-party modules
 */

import type { Module, ModuleManifest } from './types'

export class ModuleLoader {
  private loadedModules = new Map<string, Module>()
  private moduleScripts = new Map<string, HTMLScriptElement>()

  /**
   * Load a module from a URL (for third-party modules)
   */
  async loadModuleFromUrl(manifestUrl: string): Promise<Module> {
    try {
      // Fetch the manifest
      const manifestResponse = await fetch(manifestUrl)
      const manifest: ModuleManifest = await manifestResponse.json()

      // Check if module is already loaded
      if (this.loadedModules.has(manifest.id)) {
        return this.loadedModules.get(manifest.id)!
      }

      // Load the module script
      const module = await this.loadScript(manifest)
      
      // Store the loaded module
      this.loadedModules.set(manifest.id, module)
      
      return module
    } catch (error) {
      console.error('Failed to load module:', error)
      throw error
    }
  }

  /**
   * Load a module script and return the module
   */
  private async loadScript(manifest: ModuleManifest): Promise<Module> {
    return new Promise((resolve, reject) => {
      // Create script element
      const script = document.createElement('script')
      script.src = manifest.entryPoint
      script.type = 'module'
      script.async = true
      
      // Set up load handlers
      script.onload = () => {
        // The module should register itself via window.OpenChoreo.registerModule
        const module = (window as any).__openChoreoModules?.[manifest.id]
        if (module) {
          resolve(module)
        } else {
          reject(new Error(`Module ${manifest.id} did not register itself`))
        }
      }
      
      script.onerror = () => {
        reject(new Error(`Failed to load module script: ${manifest.entryPoint}`))
      }
      
      // Add script to document
      document.head.appendChild(script)
      this.moduleScripts.set(manifest.id, script)
    })
  }

  /**
   * Unload a module
   */
  async unloadModule(moduleId: string): Promise<void> {
    // Remove script element
    const script = this.moduleScripts.get(moduleId)
    if (script) {
      script.remove()
      this.moduleScripts.delete(moduleId)
    }
    
    // Remove from loaded modules
    this.loadedModules.delete(moduleId)
    
    // Clean up global registration
    if ((window as any).__openChoreoModules?.[moduleId]) {
      delete (window as any).__openChoreoModules[moduleId]
    }
  }

  /**
   * Get all loaded modules
   */
  getLoadedModules(): Module[] {
    return Array.from(this.loadedModules.values())
  }

  /**
   * Check if a module is loaded
   */
  isModuleLoaded(moduleId: string): boolean {
    return this.loadedModules.has(moduleId)
  }
}

// Global module registration helper for third-party modules
if (typeof window !== 'undefined') {
  (window as any).__openChoreoModules = {}
  
  // Add registration function to the existing OpenChoreo object
  if ((window as any).OpenChoreo) {
    (window as any).OpenChoreo.registerModule = (module: Module) => {
      (window as any).__openChoreoModules[module.id] = module
    }
  }
}