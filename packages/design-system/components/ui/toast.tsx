"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@repo/design-system/lib/utils"
import { Cross2Icon } from "@radix-ui/react-icons"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-xl border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "bg-black/80 backdrop-blur-xl border-white/10 text-white",
        destructive:
          "destructive group bg-red-900/80 backdrop-blur-xl border-red-400/20 text-red-100",
        success:
          "success group bg-green-900/80 backdrop-blur-xl border-green-400/20 text-green-100",
        warning:
          "warning group bg-yellow-900/80 backdrop-blur-xl border-yellow-400/20 text-yellow-100",
        info:
          "info group bg-blue-900/80 backdrop-blur-xl border-blue-400/20 text-blue-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/10 backdrop-blur-sm px-3 text-sm font-medium text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-1 focus:ring-white/30 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-red-400/30 group-[.destructive]:bg-red-500/20 group-[.destructive]:hover:bg-red-500/30 group-[.destructive]:hover:text-red-100 group-[.destructive]:focus:ring-red-400/50 group-[.success]:border-green-400/30 group-[.success]:bg-green-500/20 group-[.success]:hover:bg-green-500/30 group-[.success]:hover:text-green-100 group-[.success]:focus:ring-green-400/50 group-[.warning]:border-yellow-400/30 group-[.warning]:bg-yellow-500/20 group-[.warning]:hover:bg-yellow-500/30 group-[.warning]:hover:text-yellow-100 group-[.warning]:focus:ring-yellow-400/50 group-[.info]:border-blue-400/30 group-[.info]:bg-blue-500/20 group-[.info]:hover:bg-blue-500/30 group-[.info]:hover:text-blue-100 group-[.info]:focus:ring-blue-400/50",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-1 top-1 rounded-md p-1 text-white/70 opacity-0 transition-all hover:text-white hover:bg-white/10 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-white/30 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-100 group-[.destructive]:hover:bg-red-500/20 group-[.destructive]:focus:ring-red-400/50 group-[.success]:text-green-300 group-[.success]:hover:text-green-100 group-[.success]:hover:bg-green-500/20 group-[.success]:focus:ring-green-400/50 group-[.warning]:text-yellow-300 group-[.warning]:hover:text-yellow-100 group-[.warning]:hover:bg-yellow-500/20 group-[.warning]:focus:ring-yellow-400/50 group-[.info]:text-blue-300 group-[.info]:hover:text-blue-100 group-[.info]:hover:bg-blue-500/20 group-[.info]:focus:ring-blue-400/50",
      className
    )}
    toast-close=""
    {...props}
  >
    <Cross2Icon className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold text-white [&+div]:text-xs", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm text-white/80 opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
