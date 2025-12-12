import { cn } from "@/utils/cn";
import { type TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaInputProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  errors?: string;
  classNameParent?: string;
  required?: boolean;
  helperText?: string;
}

const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  (props, ref) => {
    const {
      label,
      errors,
      className,
      classNameParent,
      required,
      helperText,
      rows = 3,
      ...rest
    } = props;

    return (
      <div className={`w-full ${classNameParent}`}>
        {label ? (
          <label
            className={cn(
              "block text-sm font-medium mb-2",
              errors ? "text-red-600" : "text-gray-700"
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        ) : null}

        <textarea
          ref={ref}
          rows={rows}
          {...rest}
          className={cn(
            "mt-1 block w-full px-3 py-2 bg-white rounded-sm text-sm shadow-xs placeholder-slate-400 focus:outline-none focus:ring-1 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none resize-y",
            errors
              ? "border border-red-500 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
              : "border border-slate-300 focus:border-sky-500 focus:ring-sky-500",
            className
          )}
          aria-invalid={!!errors}
          aria-describedby={
            errors
              ? "textarea-error-text"
              : helperText
              ? "textarea-helper-text"
              : undefined
          }
        />

        {errors ? (
          <p
            id="textarea-error-text"
            className="mt-1 text-xs font-medium text-red-600"
          >
            {errors}
          </p>
        ) : helperText ? (
          <p id="textarea-helper-text" className="mt-1 text-xs text-slate-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

TextareaInput.displayName = "TextareaInput";

export default TextareaInput;
