import * as React from "react";
import { cn } from "../../lib/utils";

export function Input({ className, label, error, ...props }) {
  const [focused, setFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);

  React.useEffect(() => {
    setHasValue(!!props.value || !!props.defaultValue);
  }, [props.value, props.defaultValue]);

  return (
    <div className="relative w-full space-y-1">
      <div className="relative">
        <input
          className={cn(
            "w-full bg-surface-elevated/50 border border-border rounded-xl px-4 py-4 text-white placeholder-transparent transition-all duration-200 outline-none",
            "focus:border-accent-1/50 focus:ring-2 focus:ring-accent-1/10",
            (focused || hasValue) && "pt-6 pb-2",
            error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10",
            className
          )}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            setHasValue(!!e.target.value);
          }}
          onChange={(e) => {
            setHasValue(!!e.target.value);
            props.onChange?.(e);
          }}
          {...props}
        />
        {label && (
          <label
            className={cn(
              "absolute left-4 top-4 text-gray-500 transition-all duration-200 pointer-events-none",
              (focused || hasValue) && "text-[10px] top-1.5 text-accent-1 font-semibold uppercase tracking-wider"
            )}
          >
            {label}
          </label>
        )}
      </div>
      {error && <span className="text-xs text-red-400 ml-1">{error}</span>}
    </div>
  );
}
