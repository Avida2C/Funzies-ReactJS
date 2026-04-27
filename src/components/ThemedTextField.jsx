import { forwardRef, useId, useMemo } from "react";
import { useTheme } from "../theme/themeContext";

/**
 * Text input styled like the header search: primary border, white field, theme-aware text/placeholder.
 * Optional label, multiline (textarea), and trailing slot (e.g. search submit button).
 */
const ThemedTextField = forwardRef(function ThemedTextField(
  {
    label,
    required = false,
    id: idProp,
    className = "",
    inputClassName = "",
    wrapperStyle = {},
    error = false,
    helperText = "",
    multiline = false,
    rows = 4,
    size = "md",
    endAdornment = null,
    ...rest
  },
  ref,
) {
  const { colors, mode } = useTheme();
  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const placeholderKey = useMemo(() => inputId.replace(/[^a-zA-Z0-9_-]/g, "_"), [inputId]);

  const fieldTextColor = mode === "dark" ? "#1f2a36" : colors.text;
  const placeholderColor = mode === "dark" ? "#6b7280" : "#9ca3af";

  const Component = multiline ? "textarea" : "input";
  const isCompact = size === "sm";
  const wrapperHeight = !multiline && isCompact ? "h-9" : "";
  const inputSpacing = multiline ? "min-h-32 py-2" : isCompact ? "h-full min-h-0 py-0" : "min-h-11 py-2";

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={inputId} className="label-text mb-2 block text-base">
          <span className="text-base-content">{label}</span>
          {required ? <span style={{ color: colors.primary }}> *</span> : null}
        </label>
      ) : null}
      <div
        className={`flex w-full items-stretch overflow-hidden rounded border ${wrapperHeight}`.trim()}
        style={{
          borderColor: colors.primary,
          backgroundColor: colors.white,
          ...wrapperStyle,
          ...(error ? { boxShadow: `0 0 0 1px ${colors.primary}` } : {}),
        }}
      >
        <Component
          ref={ref}
          id={inputId}
          data-funzies-ph={placeholderKey}
          className={`w-full flex-1 bg-transparent px-3 text-sm outline-none ${inputSpacing} ${multiline ? "resize-y" : ""} ${inputClassName}`.trim()}
          style={{ color: fieldTextColor, caretColor: fieldTextColor }}
          {...(multiline ? { rows } : {})}
          {...rest}
          required={required}
        />
        <style>{`[data-funzies-ph="${placeholderKey}"]::placeholder { color: ${placeholderColor}; opacity: 1; }`}</style>
        {endAdornment ? <span className="flex shrink-0 items-stretch">{endAdornment}</span> : null}
      </div>
      {helperText ? (
        <p className={`mt-1 text-sm ${error ? "text-error" : "text-base-content/60"}`.trim()}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default ThemedTextField;
