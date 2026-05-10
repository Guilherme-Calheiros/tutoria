import { forwardRef } from "react";

type SectionProps = React.HTMLAttributes<HTMLDivElement> & {
    titulo: string;
    children: React.ReactNode;
}

const Section = forwardRef<HTMLDivElement, SectionProps>(( { titulo, children, className, ...props }, ref ) => {
    return (
        <div ref={ref} {...props} className={`border border-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm ${className ?? ""}`}>
            <h2 className="text-sm font-semibold text-foreground tracking-wide">{titulo}</h2>
            {children}
        </div>
    )
})

export default Section;