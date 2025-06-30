"use client"

import type React from "react"

import { forwardRef, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  showPasswordToggle?: boolean
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ className, label, error, icon, showPasswordToggle, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={props.id} className="text-sm font-medium">
            {label}
          </Label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">{icon}</div>
          )}
          <Input
            type={inputType}
            className={cn(
              icon && "pl-10",
              showPasswordToggle && "pr-10",
              error && "border-destructive focus-visible:ring-destructive",
              className,
            )}
            ref={ref}
            {...props}
          />
          {showPasswordToggle && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          )}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  },
)

FormField.displayName = "FormField"

export { FormField }
