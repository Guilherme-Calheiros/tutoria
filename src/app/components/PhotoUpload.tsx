type PhotoUploadProps = {
    username: string
    displayUrl: string | null
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    uploading: boolean
    errorMessage?: string
}

export default function PhotoUpload({ username,displayUrl, onFileChange, uploading, errorMessage }: PhotoUploadProps) {
    return (
        <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-secondary flex items-center justify-center shrink-0">
                {displayUrl ? (
                    <img src={displayUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
                ) : (
                    <span className="font-medium text-primary">{username.charAt(0).toUpperCase()}</span>
                )}
            </div>
            <div className="flex flex-col gap-1.5">
                <label
                    htmlFor="foto"
                    className={`cursor-pointer text-sm font-medium text-primary hover:underline w-fit ${uploading ? "opacity-50 pointer-events-none" : ""}`}
                >
                    {uploading ? "Enviando..." : "Alterar foto"}
                </label>
                <input
                    id="foto"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={onFileChange}
                />
                <span className="text-xs text-muted-foreground">JPG, PNG ou WebP — máx. 2MB</span>
                {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            </div>
        </div>
    )
}
