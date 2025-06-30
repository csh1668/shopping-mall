"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  press?: boolean
  delay?: number
}

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, hover = true, press = true, delay = 0, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "transition-all duration-300 ease-out",
          hover && "hover:shadow-lg hover:-translate-y-1",
          press && "active:scale-[0.98]",
          "animate-in fade-in slide-in-from-bottom-4",
          className,
        )}
        style={{
          animationDelay: `${delay}ms`,
          animationFillMode: "both",
        }}
        {...props}
      >
        {children}
      </Card>
    )
  },
)

AnimatedCard.displayName = "AnimatedCard"

export { AnimatedCard }
