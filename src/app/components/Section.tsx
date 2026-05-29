import { forwardRef } from "react";

type SectionProps = React.HTMLAttributes<HTMLDivElement> & {
    titulo: string;
    subtitulo?: string;
    children: React.ReactNode;
}

const Section = forwardRef<HTMLDivElement, SectionProps>(( { titulo, subtitulo, children, className, ...props }, ref ) => {
    return (
        <div ref={ref} {...props} className={`border border-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm ${className ?? ""}`}>
            <h2 className="text-sm font-semibold text-foreground tracking-wide">{titulo}</h2>
            {subtitulo && <p className="text-xs text-muted-foreground -mt-2">{subtitulo}</p>}
            {children}
        </div>
    )
})

export default Section;