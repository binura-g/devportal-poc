import React from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { useGlobalStore } from '@/stores/global.store'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  GitBranch,
  Activity,
  FileText,
  Shield,
  Cloud,
  Settings,
  Database,
  Server,
  Key,
  Users,
  BarChart3,
  AlertCircle,
  Layers,
  Workflow,
  Monitor,
  HardDrive,
  Network,
  ChevronDown
} from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  path: string
  badge?: string | number
  children?: NavItem[]
}

// Development perspective navigation items
const developmentNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-4 w-4" />,
    path: '/',
  },
  {
    id: 'components',
    label: 'Components',
    icon: <Package className="h-4 w-4" />,
    path: '/components',
  },
  {
    id: 'deployments',
    label: 'Deployments',
    icon: <GitBranch className="h-4 w-4" />,
    path: '/deployments',
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    icon: <Activity className="h-4 w-4" />,
    path: '/monitoring',
  },
  {
    id: 'logs',
    label: 'Logs',
    icon: <FileText className="h-4 w-4" />,
    path: '/logs',
  },
  {
    id: 'security',
    label: 'Security',
    icon: <Shield className="h-4 w-4" />,
    path: '/security',
  },
  {
    id: 'api-docs',
    label: 'API Documentation',
    icon: <FileText className="h-4 w-4" />,
    path: '/api-docs',
  },
]

// Platform Engineering perspective navigation items
const platformEngineeringNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-4 w-4" />,
    path: '/',
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    icon: <Server className="h-4 w-4" />,
    path: '/infrastructure',
    children: [
      {
        id: 'clusters',
        label: 'Clusters',
        icon: <Network className="h-4 w-4" />,
        path: '/infrastructure/clusters',
      },
      {
        id: 'nodes',
        label: 'Nodes',
        icon: <HardDrive className="h-4 w-4" />,
        path: '/infrastructure/nodes',
      },
      {
        id: 'storage',
        label: 'Storage',
        icon: <Database className="h-4 w-4" />,
        path: '/infrastructure/storage',
      },
    ],
  },
  {
    id: 'platform-services',
    label: 'Platform Services',
    icon: <Layers className="h-4 w-4" />,
    path: '/platform-services',
  },
  {
    id: 'ci-cd',
    label: 'CI/CD Pipelines',
    icon: <Workflow className="h-4 w-4" />,
    path: '/ci-cd',
  },
  {
    id: 'observability',
    label: 'Observability',
    icon: <Monitor className="h-4 w-4" />,
    path: '/observability',
  },
  {
    id: 'security-compliance',
    label: 'Security & Compliance',
    icon: <Shield className="h-4 w-4" />,
    path: '/security-compliance',
  },
  {
    id: 'cost-management',
    label: 'Cost Management',
    icon: <BarChart3 className="h-4 w-4" />,
    path: '/cost-management',
  },
  {
    id: 'team-management',
    label: 'Team Management',
    icon: <Users className="h-4 w-4" />,
    path: '/team-management',
  },
  {
    id: 'incidents',
    label: 'Incidents',
    icon: <AlertCircle className="h-4 w-4" />,
    path: '/incidents',
    badge: 3,
  },
]

interface NavItemComponentProps {
  item: NavItem
  isActive: boolean
  level?: number
}

function NavItemComponent({ item, isActive, level = 0 }: NavItemComponentProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const hasChildren = item.children && item.children.length > 0
  const location = useLocation()

  const isChildActive = React.useMemo(() => {
    if (!hasChildren) return false
    return item.children!.some(child => location.pathname === child.path)
  }, [hasChildren, item.children, location.pathname])

  React.useEffect(() => {
    if (isChildActive) {
      setIsExpanded(true)
    }
  }, [isChildActive])

  return (
    <div>
      <Link
        to={item.path}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault()
            setIsExpanded(!isExpanded)
          }
        }}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
          isActive && "bg-accent text-accent-foreground",
          level > 0 && "ml-6"
        )}
      >
        {item.icon}
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
            {item.badge}
          </span>
        )}
        {hasChildren && (
          <ChevronDown 
            className={cn(
              "h-4 w-4 transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        )}
      </Link>
      
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {item.children!.map((child) => (
            <NavItemComponent
              key={child.id}
              item={child}
              isActive={location.pathname === child.path}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const location = useLocation()
  const { perspective } = useGlobalStore()
  
  const navItems = perspective === 'development' 
    ? developmentNavItems 
    : platformEngineeringNavItems

  return (
    <aside className="w-64 border-r bg-muted/40 min-h-screen">
      <nav className="flex flex-col gap-1 p-4">
        <div className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {perspective === 'development' ? 'Development' : 'Platform'}
        </div>
        
        {navItems.map((item) => (
          <NavItemComponent
            key={item.id}
            item={item}
            isActive={location.pathname === item.path}
          />
        ))}
        
        <div className="mt-auto pt-4 border-t">
          <Link
            to="/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
              location.pathname === '/settings' && "bg-accent text-accent-foreground"
            )}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </div>
      </nav>
    </aside>
  )
}