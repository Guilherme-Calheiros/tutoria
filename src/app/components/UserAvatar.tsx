import { FaUser } from "react-icons/fa"

type UserAvatarProps = {
    name: string
    src?: string | null
    alt?: string
    size?: "sm" | "md" | "lg" | "xl"
    className?: string
}

const sizeClasses = {
    sm: "w-7 h-7 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-20 h-20 text-3xl",
    xl: "w-24 h-24 text-3xl",
}

export default function UserAvatar({ name, src, alt = "", size = "md", className = "" }: UserAvatarProps) {
    return (
        <div className={`rounded-full overflow-hidden bg-secondary flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
            {src ? (
                <img src={src} alt={alt} className="w-full h-full object-cover" />
            ) : (
                <span className="font-medium text-primary">{name.charAt(0).toUpperCase()}</span>
            )}
        </div>
    )
}
