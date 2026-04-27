import { useId } from "react";
import { FiCheck } from "react-icons/fi";
import { useTheme } from "../theme/themeContext";

export default function ThemedCheckbox({
  checked,
  onChange,
  label,
  className = "",
  labelClassName = "",
  id: idProp,
  disabled = false,
  ...props
}) {
  const { colors } = useTheme();
  const generatedId = useId();
  const inputId = idProp ?? generatedId;

  return (
    <label
      htmlFor={inputId}
      className={`flex cursor-pointer items-start gap-2 ${disabled ? "opacity-60" : ""} ${className}`.trim()}
    >
      <input
        id={inputId}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      <span
        aria-hidden
        className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border pt-[0.2rem] transition-colors"
        style={{
          borderColor: colors.primary,
          backgroundColor: checked ? colors.primary : colors.white,
        }}
      >
        {checked ? <FiCheck size={17} color={colors.white} strokeWidth={3} /> : null}
      </span>
      {label ? <span className={`text-sm text-base-content md:text-base ${labelClassName}`.trim()}>{label}</span> : null}
    </label>
  );
}
