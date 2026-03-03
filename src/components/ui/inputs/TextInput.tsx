import { cn } from "@/utils/cn";
import { type InputHTMLAttributes, forwardRef, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errors?: string;
  classNameParent?: string;
  required?: boolean;
  helperText?: string;
}

const TextInput = forwardRef<HTMLInputElement, InputTextProps>((props, ref) => {
  const {
    label,
    errors,
    className,
    classNameParent,
    required,
    helperText,
    type,
    ...rest
  } = props;

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={`w-full ${classNameParent}`}>
      {label ? (
        <label
          className={cn(
            "block text-sm font-medium mb-2",
            errors ? "text-red-600" : "text-gray-700",
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      ) : null}

      <div className="relative">
        <input
          ref={ref}
          {...rest}
          type={isPassword && showPassword ? "text" : type}
          className={cn(
            "mt-1 block text-gray-600 w-full px-3 py-2 pr-10 bg-white rounded-sm text-sm shadow-xs placeholder-slate-400 focus:outline-none focus:ring-1 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none",
            errors
              ? "border border-red-500 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
              : "border border-slate-300 focus:border-sky-500 focus:ring-sky-500",
            className,
          )}
          aria-invalid={!!errors}
          aria-describedby={
            errors
              ? "input-error-text"
              : helperText
                ? "input-helper-text"
                : undefined
          }
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute hover:cursor-pointer inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>

      {errors ? (
        <p
          id="input-error-text"
          className="mt-1 text-xs font-medium text-red-600"
        >
          {errors}
        </p>
      ) : helperText ? (
        <p id="input-helper-text" className="mt-1 text-xs text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

TextInput.displayName = "TextInput";

export default TextInput;
