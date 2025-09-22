import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useGlobalStore } from '@/stores/global.store'
import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ComponentFormData {
  // Step 1: Component Metadata
  componentName: string
  displayName: string
  description: string
  componentType: string
  
  // Step 2: CI Setup
  buildpackType: 'dockerfile' | 'buildpack' | ''
  dockerfilePath: string
  dockerContext: string
  runCommand: string
  port: string
  autoDeployBranch: string
  
  // Step 3: Review
  confirmCreation: boolean
}

export function CreateComponent() {
  const navigate = useNavigate()
  const { currentProject } = useGlobalStore()
  const [step, setStep] = useState(1)
  
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<ComponentFormData>({
    mode: 'onChange',
    defaultValues: {
      componentName: '',
      displayName: '',
      description: '',
      componentType: '',
      buildpackType: '',
      dockerfilePath: '',
      dockerContext: '',
      runCommand: '',
      port: '',
      autoDeployBranch: 'main',
      confirmCreation: false,
    },
  })

  const componentTypes = [
    'Service',
    'Job', 
    'Manual Task',
    'Webhook',
    'Scheduled Task',
    'Event Handler',
    'Test Runner',
  ]

  const totalSteps = 3
  const buildpackType = watch('buildpackType')
  const confirmCreation = watch('confirmCreation')

  const validateStep = async () => {
    let fieldsToValidate: (keyof ComponentFormData)[] = []
    
    switch (step) {
      case 1:
        fieldsToValidate = ['componentName', 'componentType']
        break
      case 2:
        fieldsToValidate = ['buildpackType']
        if (buildpackType === 'dockerfile') {
          fieldsToValidate.push('dockerfilePath', 'dockerContext')
        }
        break
      case 3:
        fieldsToValidate = ['confirmCreation']
        break
    }
    
    return await trigger(fieldsToValidate)
  }

  const handleNext = async () => {
    const isStepValid = await validateStep()
    if (isStepValid && step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const onSubmit = (data: ComponentFormData) => {
    console.log('Creating component:', data)
    // In a real app, this would call an API to create the component
    navigate({ to: '/components' })
  }

  const formValues = watch()

  return (
    <div className="min-h-full bg-gray-50/50">
      <div className="max-w-4xl p-8">
        {/* Header with back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: '/components' })}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Title and Description */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Create new Component</h1>
          <p className="text-gray-600">
            Create a new component in {currentProject?.name || 'the selected project'}.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute left-0 right-0 top-5 h-[1px] bg-gray-300" />
            
            {/* Step Indicators */}
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="relative z-10 flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step === stepNumber
                      ? "bg-blue-600 text-white"
                      : step > stepNumber
                      ? "bg-blue-600 text-white"
                      : "bg-gray-400 text-white"
                  )}
                >
                  {stepNumber}
                </div>
                <span className={cn(
                  "mt-2 text-sm",
                  step === stepNumber ? "text-gray-900 font-medium" : "text-gray-500"
                )}>
                  {stepNumber === 1 ? 'Component Metadata' : stepNumber === 2 ? 'CI Setup' : 'Review'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="p-8 border-0 shadow-sm">
            {/* Step 1: Component Metadata */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="componentName" className="text-gray-700 mb-2 block">
                    Component Name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="componentName"
                    {...register('componentName', {
                      required: 'Component name is required',
                      pattern: {
                        value: /^[a-z0-9-]+$/,
                        message: 'Only lowercase letters, numbers, and hyphens allowed',
                      },
                      minLength: {
                        value: 3,
                        message: 'Component name must be at least 3 characters',
                      },
                    })}
                    placeholder="my-component"
                    className={cn("h-10", errors.componentName && "border-red-500")}
                  />
                  {errors.componentName && (
                    <p className="text-sm text-red-500 mt-1">{errors.componentName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="displayName" className="text-gray-700 mb-2 block">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    {...register('displayName')}
                    placeholder="My Component"
                    className="h-10"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-700 mb-2 block">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    {...register('description', {
                      maxLength: {
                        value: 500,
                        message: 'Description must be less than 500 characters',
                      },
                    })}
                    placeholder="Help others understand what this component is for."
                    rows={3}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="componentType" className="text-gray-700 mb-2 block">
                    Component Type<span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="componentType"
                    control={control}
                    rules={{ required: 'Component type is required' }}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger 
                          id="componentType" 
                          className={cn("h-10", errors.componentType && "border-red-500")}
                        >
                          <SelectValue placeholder="Select a component type" />
                        </SelectTrigger>
                        <SelectContent>
                          {componentTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.componentType && (
                    <p className="text-sm text-red-500 mt-1">{errors.componentType.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: CI Setup */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-gray-700 mb-4 block">
                    Choose your buildpack<span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="buildpackType"
                    control={control}
                    rules={{ required: 'Please select a build type' }}
                    render={({ field }) => (
                      <RadioGroup value={field.value} onValueChange={field.onChange}>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <RadioGroupItem value="dockerfile" id="dockerfile" className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor="dockerfile" className="font-medium cursor-pointer">
                                Dockerfile
                              </Label>
                              <p className="text-sm text-gray-600 mt-1">
                                Use an existing Dockerfile to build your container image
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <RadioGroupItem value="buildpack" id="buildpack" className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor="buildpack" className="font-medium cursor-pointer">
                                Buildpack (Auto-detect)
                              </Label>
                              <p className="text-sm text-gray-600 mt-1">
                                Automatically detect and build your application using Cloud Native Buildpacks
                              </p>
                            </div>
                          </div>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {errors.buildpackType && (
                    <p className="text-sm text-red-500 mt-1">{errors.buildpackType.message}</p>
                  )}
                </div>

                {buildpackType === 'dockerfile' && (
                  <>
                    <div>
                      <Label htmlFor="dockerfilePath" className="text-gray-700 mb-2 block">
                        Dockerfile Path<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="dockerfilePath"
                        {...register('dockerfilePath', {
                          required: buildpackType === 'dockerfile' ? 'Dockerfile path is required' : false,
                        })}
                        placeholder="./Dockerfile"
                        className={cn("h-10", errors.dockerfilePath && "border-red-500")}
                      />
                      {errors.dockerfilePath && (
                        <p className="text-sm text-red-500 mt-1">{errors.dockerfilePath.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="dockerContext" className="text-gray-700 mb-2 block">
                        Docker Build Context<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="dockerContext"
                        {...register('dockerContext', {
                          required: buildpackType === 'dockerfile' ? 'Docker context is required' : false,
                        })}
                        placeholder="./"
                        className={cn("h-10", errors.dockerContext && "border-red-500")}
                      />
                      {errors.dockerContext && (
                        <p className="text-sm text-red-500 mt-1">{errors.dockerContext.message}</p>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="runCommand" className="text-gray-700 mb-2 block">
                    Run Command (Optional)
                  </Label>
                  <Input
                    id="runCommand"
                    {...register('runCommand')}
                    placeholder="npm start"
                    className="h-10"
                  />
                  <p className="text-xs text-gray-500 mt-1">Override the default run command</p>
                </div>

                <div>
                  <Label htmlFor="port" className="text-gray-700 mb-2 block">
                    Port
                  </Label>
                  <Input
                    id="port"
                    {...register('port', {
                      pattern: {
                        value: /^[0-9]*$/,
                        message: 'Port must be a number',
                      },
                      min: {
                        value: 1,
                        message: 'Port must be between 1 and 65535',
                      },
                      max: {
                        value: 65535,
                        message: 'Port must be between 1 and 65535',
                      },
                    })}
                    placeholder="8080"
                    className={cn("h-10", errors.port && "border-red-500")}
                  />
                  {errors.port ? (
                    <p className="text-sm text-red-500 mt-1">{errors.port.message}</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">The port your application listens on</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="autoDeployBranch" className="text-gray-700 mb-2 block">
                    Auto-deploy Branch
                  </Label>
                  <Input
                    id="autoDeployBranch"
                    {...register('autoDeployBranch')}
                    placeholder="main"
                    className="h-10"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Automatically deploy when changes are pushed to this branch
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-medium text-lg mb-4">Review Component Configuration</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-600 mb-2">Component Details</h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Name:</dt>
                          <dd className="text-sm font-medium">{formValues.componentName || '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Display Name:</dt>
                          <dd className="text-sm font-medium">{formValues.displayName || '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Type:</dt>
                          <dd className="text-sm font-medium">{formValues.componentType || '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Project:</dt>
                          <dd className="text-sm font-medium">{currentProject?.name || '-'}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium text-sm text-gray-600 mb-2">CI Configuration</h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Build Type:</dt>
                          <dd className="text-sm font-medium">
                            {formValues.buildpackType === 'dockerfile' ? 'Dockerfile' : 
                             formValues.buildpackType === 'buildpack' ? 'Buildpack (Auto-detect)' : '-'}
                          </dd>
                        </div>
                        {formValues.dockerfilePath && (
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Dockerfile Path:</dt>
                            <dd className="text-sm font-medium">{formValues.dockerfilePath}</dd>
                          </div>
                        )}
                        {formValues.dockerContext && (
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Docker Context:</dt>
                            <dd className="text-sm font-medium">{formValues.dockerContext}</dd>
                          </div>
                        )}
                        {formValues.port && (
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Port:</dt>
                            <dd className="text-sm font-medium">{formValues.port}</dd>
                          </div>
                        )}
                        {formValues.autoDeployBranch && (
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Auto-deploy Branch:</dt>
                            <dd className="text-sm font-medium">{formValues.autoDeployBranch}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Controller
                    name="confirmCreation"
                    control={control}
                    rules={{ required: 'Please confirm to create the component' }}
                    render={({ field }) => (
                      <Checkbox
                        id="confirm"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1"
                      />
                    )}
                  />
                  <div>
                    <Label htmlFor="confirm" className="text-sm cursor-pointer">
                      I confirm that the above information is correct and I want to create this component
                    </Label>
                  </div>
                </div>
                {errors.confirmCreation && (
                  <p className="text-sm text-red-500">{errors.confirmCreation.message}</p>
                )}
              </div>
            )}
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="text-gray-600"
            >
              BACK
            </Button>
            {step < totalSteps ? (
              <Button 
                type="button"
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                NEXT
              </Button>
            ) : (
              <Button 
                type="submit"
                disabled={!confirmCreation}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 disabled:opacity-50"
              >
                CREATE
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}