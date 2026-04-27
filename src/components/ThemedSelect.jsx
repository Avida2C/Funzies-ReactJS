import { forwardRef, useId, useMemo } from "react";
import { useTheme } from "../theme/themeContext";

/**
 * Select input styled like ThemedTextField: primary border, white field, theme-aware text.
 */
const ThemedSelect = forwardRef(function ThemedSelect(
  {
    label,
    required = false,
    id: idProp,
    className = "",
    inputClassName = "",
    size = "md",
    children,
    ...rest
  },
  ref,
) {
  const { colors, mode } = useTheme();
  const generatedId = useId();
  const inputId = idProp ?? generatedId;

  const fieldTextColor = mode === "dark" ? "#1f2a36" : colors.text;

  const isCompact = size === "sm";
  const wrapperHeight = isCompact ? "h-9" : "";
  const inputSpacing = isCompact ? "h-full min-h-0 py-0" : "min-h-11 py-2";

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
        style={{ borderColor: colors.primary, backgroundColor: colors.white }}
      >
        <select
          ref={ref}
          id={inputId}
          className={`w-full flex-1 bg-transparent px-3 text-sm outline-none ${inputSpacing} ${inputClassName}`.trim()}
          style={{ color: fieldTextColor }}
          required={required}
          {...rest}
        >
          {children}
        </select>
      </div>
    </div>
  );
});

export default ThemedSelect;
