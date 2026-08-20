import { forwardRef, useId, useMemo, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
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
    type = "text",
    endAdornment = null,
    passwordToggle,
    ...rest
  },
  ref,
) {
  const { colors, mode } = useTheme();
  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const placeholderKey = useMemo(() => inputId.replace(/[^a-zA-Z0-9_-]/g, "_"), [inputId]);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const fieldTextColor = mode === "dark" ? "#1f2a36" : colors.text;
  const placeholderColor = mode === "dark" ? "#6b7280" : "#9ca3af";
  const isPassword = type === "password";
  const showPasswordToggle = isPassword && passwordToggle !== false;
  const inputType = showPasswordToggle ? (passwordVisible ? "text" : "password") : type;
  const passwordToggleAdornment = showPasswordToggle ? (
    <button
      type="button"
      className="flex items-center px-3"
      onClick={() => setPasswordVisible((visible) => !visible)}
      aria-label={passwordVisible ? "Hide password" : "Show password"}
      aria-pressed={passwordVisible}
      title={passwordVisible ? "Hide password" : "Show password"}
    >
      {passwordVisible ? (
        <FiEyeOff size={16} style={{ color: "#8896b2" }} aria-hidden />
      ) : (
        <FiEye size={16} style={{ color: "#8896b2" }} aria-hidden />
      )}
    </button>
  ) : null;
  const resolvedAdornment = passwordToggleAdornment ?? endAdornment;

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
          {...rest}
          {...(multiline ? { rows } : { type: inputType })}
          required={required}
        />
        <style>{`[data-funzies-ph="${placeholderKey}"]::placeholder { color: ${placeholderColor}; opacity: 1; }`}</style>
        {resolvedAdornment ? <span className="flex shrink-0 items-stretch">{resolvedAdornment}</span> : null}
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
