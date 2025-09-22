/**
 * Shared dependencies that are provided to all modules
 * These are not bundled with modules but referenced from the host
 */

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useGlobalStore } from '@/stores/global.store'
import * as LucideIcons from 'lucide-react'

// UI Components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Utility functions
import { cn } from '@/lib/utils'

/**
 * These dependencies are made available globally to all modules
 * Modules can access them via window.OpenChoreo
 */
export const sharedDependencies = {
  // Core React
  React,
  ReactDOM,
  
  // State & Data
  ReactQuery: {
    useQuery,
    useMutation,
    useQueryClient,
  },
  ReactHookForm: {
    useForm,
  },
  Store: {
    useGlobalStore,
  },
  
  // UI Components
  UI: {
    // Basic
    Button,
    Badge,
    Input,
    Label,
    Switch,
    
    // Card
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    
    // Select
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    
    // Dialog
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    
    // Command
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    
    // Popover
    Popover,
    PopoverContent,
    PopoverTrigger,
    
    // Table
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  },
  
  // Icons
  Icons: LucideIcons,
  
  // Utils
  Utils: {
    cn,
  },
}

// Make dependencies available globally for third-party modules
if (typeof window !== 'undefined') {
  (window as any).OpenChoreo = sharedDependencies
}

/**
 * Type definitions for third-party modules
 */
export type SharedDependencies = typeof sharedDependencies

declare global {
  interface Window {
    OpenChoreo: SharedDependencies
  }
}