"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"

type PopoverRootProps = React.ComponentProps<typeof PopoverPrimitive.Root>

const PopoverOpenContext = React.createContext<boolean | undefined>(undefined)

function Popover({
  open: openProp,
  defaultOpen,
  onOpenChange,
  ...props
}: PopoverRootProps) {
  const [openState, setOpenState] = React.useState(defaultOpen ?? false)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : openState

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setOpenState(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange]
  )

  return (
    <PopoverOpenContext.Provider value={open}>
      <PopoverPrimitive.Root
        data-slot="popover"
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </PopoverOpenContext.Provider>
  )
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

const surfaceClass =
  "z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-2xl bg-popover text-popover-foreground p-4 shadow-[0_1px_2px_rgba(56,37,105,0.06),0_18px_44px_-12px_rgba(56,37,105,0.22)] outline-none"

const surfaceMotion = {
  initial: { opacity: 0, scale: 0.96, y: -4 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, y: -2 },
  transition: {
    type: "spring" as const,
    stiffness: 520,
    damping: 38,
    mass: 0.7,
  },
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 6,
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  const open = React.useContext(PopoverOpenContext)
  return (
    <AnimatePresence>
      {open ? (
        <PopoverPrimitive.Portal forceMount>
          <PopoverPrimitive.Content
            data-slot="popover-content"
            align={align}
            sideOffset={sideOffset}
            asChild
            {...props}
          >
            <motion.div
              {...surfaceMotion}
              className={cn(surfaceClass, className)}
            >
              {children}
            </motion.div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      ) : null}
    </AnimatePresence>
  )
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1 text-sm", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <div
      data-slot="popover-title"
      className={cn("font-medium", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
}
