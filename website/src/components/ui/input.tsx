import * as React from "react";
import { Eye, EyeOff } from "lucide-react"; // Import icons

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showPasswordToggle?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, showPasswordToggle = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="relative">
        <input
          type={type === "password" && showPassword ? "text" : type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            type === "password" && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {type === "password" && showPasswordToggle && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <Eye className="h-4 w-4 text-gray-500" />
            ) : (
              <EyeOff className="h-4 w-4 text-gray-500" />
            )}
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
