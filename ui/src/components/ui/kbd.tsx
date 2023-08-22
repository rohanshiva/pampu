import * as React from "react"

import { cn } from "../../lib/utils"

export interface KBDProps extends React.HTMLAttributes<HTMLElement> {}

const KBD = React.forwardRef<HTMLElement, KBDProps>(
  ({ className, ...props }, ref) => {
    return (
      <kbd
        className={cn(
            "pointer-events-none right-1.5 top-1.5 h-5 select-none items-center gap-1 rounded bg-background px-1.5 font-mono text-xs font-medium opacity-100 sm:flex",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
KBD.displayName = "KBD"

export { KBD }
