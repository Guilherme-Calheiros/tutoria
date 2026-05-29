import { forwardRef } from "react";

type SectionProps = React.HTMLAttributes<HTMLDivElement> & {
    titulo: string;
    subtitulo?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}

const Section = forwardRef<HTMLDivElement, SectionProps>(( { titulo, subtitulo, action, children, className, ...props }, ref ) => {
    return (
        <div ref={ref} {...props} className={`border border-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm ${className ?? ""}`}>
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground tracking-wide">{titulo}</h2>
                {action}
            </div>
            {subtitulo && <p className="text-xs text-muted-foreground -mt-2">{subtitulo}</p>}
            {children}
        </div>
    )
})

export default Section;