import React, { useState, useEffect } from 'react'
import { useGlobalStore, type Perspective } from '@/stores/global.store'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { 
  Check, 
  ChevronDown, 
  Code2, 
  Wrench,
  FolderOpen,
  Package,
  Globe,
  User,
  Settings,
  LogOut,
  Search,
  FileText,
  GitBranch,
  Activity,
  Shield,
  LayoutDashboard
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNavigate } from '@tanstack/react-router'

interface SearchableDropdownProps {
  value: string | null
  onSelect: (value: string) => void
  items: Array<{ id: string; name: string; description?: string }>
  placeholder: string
  searchPlaceholder: string
  emptyText: string
  icon?: React.ReactNode
  className?: string
}

function SearchableDropdown({
  value,
  onSelect,
  items,
  placeholder,
  searchPlaceholder,
  emptyText,
  icon,
  className
}: SearchableDropdownProps) {
  const [open, setOpen] = useState(false)
  const selectedItem = items.find(item => item.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[240px] justify-between", className)}
        >
          <span className="flex items-center gap-2 truncate">
            {icon}
            <span className="truncate">{selectedItem ? selectedItem.name : placeholder}</span>
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={() => {
                    onSelect(item.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    {item.description && (
                      <span className="text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface PerspectiveSwitcherProps {
  perspective: Perspective
  onPerspectiveChange: (perspective: Perspective) => void
}

function PerspectiveSwitcher({ perspective, onPerspectiveChange }: PerspectiveSwitcherProps) {
  return (
    <div className="flex items-center bg-muted rounded-lg p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPerspectiveChange('platform-engineering')}
        className={cn(
          "gap-2 transition-all",
          perspective === 'platform-engineering' 
            ? 'bg-background text-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
        )}
      >
        <Wrench className="h-4 w-4" />
        Platform Engineering
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPerspectiveChange('development')}
        className={cn(
          "gap-2 transition-all",
          perspective === 'development' 
            ? 'bg-background text-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
        )}
      >
        <Code2 className="h-4 w-4" />
        Development
      </Button>
    </div>
  )
}

interface TopNavProps {
  showComponentSelector?: boolean
  showEnvironmentSelector?: boolean
}

export function TopNav({ 
  showComponentSelector = true, 
  showEnvironmentSelector = true 
}: TopNavProps) {
  const {
    perspective,
    currentProject,
    currentComponent,
    currentEnvironment,
    projects,
    environments,
    setPerspective,
    setCurrentProject,
    setCurrentComponent,
    setCurrentEnvironment,
    getComponentsForProject,
  } = useGlobalStore()

  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)

  // Get filtered components based on selected project
  const availableComponents = currentProject 
    ? getComponentsForProject(currentProject.id)
    : []

  // Reset component when project changes
  useEffect(() => {
    if (currentProject && currentComponent) {
      const componentBelongsToProject = availableComponents.some(
        c => c.id === currentComponent.id
      )
      if (!componentBelongsToProject) {
        setCurrentComponent(null)
      }
    }
  }, [currentProject, currentComponent, availableComponents])

  // Keyboard shortcut for search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <header className="border-b">
        <div className="flex h-16 items-center">
          {/* Logo/Brand - aligned with sidebar width */}
          <div className="w-64 px-4 font-semibold text-lg border-r flex items-center h-full">
            OpenChoreo
          </div>

          {/* Main nav content */}
          <div className="flex flex-1 items-center px-4 gap-4">
            {/* Project Selector */}
            <SearchableDropdown
              value={currentProject?.id || null}
              onSelect={(projectId) => {
                const project = projects.find(p => p.id === projectId)
                setCurrentProject(project || null)
              }}
              items={projects}
              placeholder="Select project"
              searchPlaceholder="Search projects..."
              emptyText="No projects found"
              icon={<FolderOpen className="h-4 w-4" />}
            />

            {/* Component Selector (conditional) */}
            {showComponentSelector && currentProject && (
              <SearchableDropdown
                value={currentComponent?.id || null}
                onSelect={(componentId) => {
                  const component = availableComponents.find(c => c.id === componentId)
                  setCurrentComponent(component || null)
                }}
                items={availableComponents}
                placeholder="Select component"
                searchPlaceholder="Search components..."
                emptyText="No components found"
                icon={<Package className="h-4 w-4" />}
                className={availableComponents.length === 0 ? 'opacity-50' : ''}
              />
            )}

            {/* Environment Selector (conditional) */}
            {showEnvironmentSelector && (
              <SearchableDropdown
                value={currentEnvironment?.id || null}
                onSelect={(envId) => {
                  const environment = environments.find(e => e.id === envId)
                  setCurrentEnvironment(environment || null)
                }}
                items={environments}
                placeholder="Select environment"
                searchPlaceholder="Search environments..."
                emptyText="No environments found"
                icon={<Globe className="h-4 w-4" />}
              />
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Search Bar */}
            <Button
              variant="outline"
              className="relative w-64 justify-start text-sm text-muted-foreground"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Search...</span>
              <kbd className="pointer-events-none absolute right-2 top-2.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>

            {/* Perspective Switcher */}
            <PerspectiveSwitcher 
              perspective={perspective}
              onPerspectiveChange={setPerspective}
            />

            {/* User Menu */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div className="flex flex-col gap-1">
                  <div className="px-2 py-1.5 text-sm font-semibold">John Doe</div>
                  <div className="px-2 pb-2 text-xs text-muted-foreground">
                    john.doe@example.com
                  </div>
                  <div className="h-px bg-border" />
                  <Button variant="ghost" className="justify-start" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button variant="ghost" className="justify-start" size="sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      {/* Command Dialog for Search */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => { navigate({ to: '/' }); setSearchOpen(false) }}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => { navigate({ to: '/components' }); setSearchOpen(false) }}>
              <Package className="mr-2 h-4 w-4" />
              <span>Components</span>
            </CommandItem>
            <CommandItem onSelect={() => { navigate({ to: '/deployments' }); setSearchOpen(false) }}>
              <GitBranch className="mr-2 h-4 w-4" />
              <span>Deployments</span>
            </CommandItem>
            <CommandItem onSelect={() => { navigate({ to: '/observability/logs' }); setSearchOpen(false) }}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Logs</span>
            </CommandItem>
            <CommandItem onSelect={() => { navigate({ to: '/observability' }); setSearchOpen(false) }}>
              <Activity className="mr-2 h-4 w-4" />
              <span>Monitoring</span>
            </CommandItem>
            <CommandItem onSelect={() => { navigate({ to: '/security-posture' }); setSearchOpen(false) }}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Security</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Projects">
            {projects.map((project) => (
              <CommandItem
                key={project.id}
                onSelect={() => {
                  setCurrentProject(project)
                  setSearchOpen(false)
                }}
              >
                <FolderOpen className="mr-2 h-4 w-4" />
                <span>{project.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          {currentProject && availableComponents.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Components">
                {availableComponents.map((component) => (
                  <CommandItem
                    key={component.id}
                    onSelect={() => {
                      setCurrentComponent(component)
                      navigate({ to: '/components' })
                      setSearchOpen(false)
                    }}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    <span>{component.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          <CommandSeparator />

          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => { navigate({ to: '/settings' }); setSearchOpen(false) }}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}