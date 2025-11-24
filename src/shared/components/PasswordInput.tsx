import React, { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ error, label, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputId = props.id || "password-input";

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-1 text-sm font-semibold text-gray-700"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            {...props}
            id={inputId}
            ref={ref}
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            inputMode="text"
            autoCapitalize="none"
            autoCorrect="off"
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={`
              w-full p-3 pr-12 rounded-lg border transition-all outline-none
              ${error ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-yellow-300"}
              focus:ring-2
              ${className}
            `}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="
              absolute right-3 top-1/2 -translate-y-1/2 
              text-gray-500 hover:text-gray-700 
              p-1 rounded focus:outline-none focus:ring-2 focus:ring-yellow-300
            "
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-red-500 text-sm mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;