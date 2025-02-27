"use client"

import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {

  return (
    <Sonner
      className="toaster group"
      position="bottom-center"
      toastOptions={{
        classNames: {
          warning: "!border-orange-400",
          error: "!border-pink-300",
          success: "!border-green-400",
          toast: [
            "group toast group-[.toaster]:border-border !border-quantum-blue",
            "group-[.toaster]:shadow-lg !rounded-lg !hypens-auto !break-words",
            "!flex !gap-3 !items-start !p-4 !pr-8"
          ].join(" "),
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
    
      {...props}
    />
  )
}

export { Toaster, toast }
