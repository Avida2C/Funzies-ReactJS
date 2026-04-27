export default function QuantityControl({
  value,
  onDecrease,
  onIncrease,
  onChange,
  colors,
  decrementAriaLabel = "Decrease quantity",
  incrementAriaLabel = "Increase quantity",
  inputAriaLabel = "Quantity",
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="hover-accent inline-flex h-7 w-7 items-center justify-center rounded border pb-[0.2rem] text-sm font-semibold"
        style={{
          borderColor: colors.border,
          color: colors.text,
          backgroundColor: colors.panel,
          "--hover-accent-bg": `${colors.primary}14`,
          "--hover-accent-border": colors.primary,
          "--hover-accent-fg": colors.primary,
        }}
        onClick={onDecrease}
        aria-label={decrementAriaLabel}
      >
        <span className="hover-accent-text">-</span>
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 w-16 rounded border px-2 text-sm"
        style={{ borderColor: colors.border, backgroundColor: colors.background, color: colors.text }}
        aria-label={inputAriaLabel}
      />
      <button
        type="button"
        className="hover-accent inline-flex h-7 w-7 items-center justify-center rounded border pb-[0.2rem] text-sm font-semibold"
        style={{
          borderColor: colors.border,
          color: colors.text,
          backgroundColor: colors.panel,
          "--hover-accent-bg": `${colors.primary}14`,
          "--hover-accent-border": colors.primary,
          "--hover-accent-fg": colors.primary,
        }}
        onClick={onIncrease}
        aria-label={incrementAriaLabel}
      >
        <span className="hover-accent-text">+</span>
      </button>
    </div>
  );
}
