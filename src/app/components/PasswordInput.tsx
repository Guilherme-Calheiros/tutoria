import { useState, forwardRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>((props, ref) => {
    const [show, setShow] = useState(false);

    return (
        <div className="relative w-full">
            <input
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                type={show ? "text" : "password"}
                ref={ref}
                {...props}
            />
            <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
            >
                {show ? <FaEye /> : <FaEyeSlash />}
            </button>
        </div>
    );
})

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;