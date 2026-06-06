"use client"

import * as RadixTabs from "@radix-ui/react-tabs"

const Root = RadixTabs.Root

function List({ className = "", ...props }: React.ComponentPropsWithoutRef<typeof RadixTabs.List>) {
    return (
        <RadixTabs.List
            className={`flex gap-1 border-b border-border overflow-x-auto ${className}`}
            {...props}
        />
    )
}

function Trigger({ className = "", ...props }: React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger>) {
    return (
        <RadixTabs.Trigger
            className={`px-4 py-2.5 text-sm font-medium text-muted-foreground whitespace-nowrap border-b-2 border-transparent data-[state=active]:text-primary data-[state=active]:border-primary hover:text-foreground transition-colors shrink-0 ${className}`}
            {...props}
        />
    )
}

function Content({ className = "", ...props }: React.ComponentPropsWithoutRef<typeof RadixTabs.Content>) {
    return (
        <RadixTabs.Content
            className={`pt-6 ${className}`}
            {...props}
        />
    )
}

const Tabs = { Root, List, Trigger, Content }

export default Tabs
