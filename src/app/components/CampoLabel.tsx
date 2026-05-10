import { forwardRef } from "react";

type CampoProps = React.HTMLAttributes<HTMLDivElement> & {
    label: string;
    valor: string;
}

const Campo = forwardRef<HTMLDivElement, CampoProps>(( { label, valor, className, ...props }, ref ) => {
    return (
        <div ref={ref} {...props} className={`flex flex-col gap-0.5 ${className ?? ""}`}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm text-foreground">{valor}</p>
        </div>
    )
})

export default Campo;