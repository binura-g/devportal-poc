# UI Components (shadcn/ui)

This directory contains UI components from [shadcn/ui](https://ui.shadcn.com/), a collection of reusable components built with Radix UI and Tailwind CSS.

## Adding New Components

To add a new shadcn/ui component to the project:

```bash
# Navigate to the app package
cd packages/app

# Add a component (example: adding the "toast" component)
npx shadcn@latest add toast

# Add multiple components at once
npx shadcn@latest add dialog select dropdown-menu
```

## Available Components

Currently installed components:
- `alert` - Alert messages and notifications
- `badge` - Status indicators and labels
- `button` - Interactive buttons with variants
- `card` - Container components for content
- `command` - Command menu (Cmd+K search)
- `dialog` - Modal dialogs and popups
- `dropdown-menu` - Dropdown menus with actions
- `input` - Form input fields
- `popover` - Floating content panels
- `select` - Select dropdowns
- `switch` - Toggle switches

## Using Components

Import components directly from the ui directory:

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
```

## Component Variants

Most components support variants for different styles:

```tsx
// Button variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Button sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Settings /></Button>
```

## Styling Guidelines

1. **Use Tailwind classes** - Components are styled with Tailwind utilities
2. **Use the `cn()` helper** - For conditional classes:
   ```tsx
   import { cn } from '@/lib/utils'
   
   <div className={cn(
     "base-classes",
     isActive && "active-classes",
     isDisabled && "disabled-classes"
   )} />
   ```

3. **Minimum font size** - This app enforces a 13px minimum font size:
   - Use `text-xs` (13px) as the smallest size
   - Default is `text-sm` (14px)
   - Body text uses `text-base` (16px)

## Form Components

For forms, combine shadcn/ui components with React Hook Form:

```tsx
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

function MyForm() {
  const { register, handleSubmit } = useForm()
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('name')} placeholder="Name" />
      <Select {...register('role')}>
        <SelectTrigger>
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dev">Developer</SelectItem>
          <SelectItem value="pe">Platform Engineer</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## Icons

Use Lucide React icons with components:

```tsx
import { Settings, User, Search } from 'lucide-react'

<Button>
  <Settings className="mr-2 h-4 w-4" />
  Settings
</Button>
```

## Dark Mode Support

All components automatically support dark mode through Tailwind's dark mode classes. The theme is controlled by the `dark` class on the root element.

## Component Documentation

For detailed documentation and examples of each component:
- Visit [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)
- Check the component source files in this directory
- Reference existing usage in the app modules

## Troubleshooting

If you encounter import errors after adding a component:

1. Check if required dependencies are installed:
   ```bash
   # Common missing dependency
   pnpm add @radix-ui/react-icons
   ```

2. Ensure the component was added successfully:
   ```bash
   ls src/components/ui/
   ```

3. Restart the dev server if needed:
   ```bash
   pnpm dev
   ```

## Best Practices

1. **Don't modify component files directly** - These are meant to be copy-paste components
2. **Create wrapper components** for app-specific behavior
3. **Use consistent variants** across the app
4. **Follow accessibility guidelines** - Components include ARIA attributes
5. **Test keyboard navigation** - Components support keyboard interaction