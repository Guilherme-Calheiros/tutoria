"use client"

export default function PoliticasPrivacidadeSection() {
    return (
        <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
                Saiba mais sobre como tratamos seus dados e os termos de uso da plataforma.
            </p>
            <ul className="flex flex-col gap-2">
                <li>
                    <a
                        href="#"
                        className="text-sm text-primary hover:underline transition-colors"
                    >
                        Política de Privacidade
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        className="text-sm text-primary hover:underline transition-colors"
                    >
                        Termos de Uso
                    </a>
                </li>
            </ul>
        </div>
    )
}
