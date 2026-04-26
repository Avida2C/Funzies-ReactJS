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
        className="inline-flex h-7 w-7 items-center justify-center rounded border pb-[0.2rem] text-sm font-semibold"
        style={{ borderColor: colors.border, color: colors.text }}
        onClick={onDecrease}
        aria-label={decrementAriaLabel}
      >
        -
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
        className="inline-flex h-7 w-7 items-center justify-center rounded border pb-[0.2rem] text-sm font-semibold"
        style={{ borderColor: colors.border, color: colors.text }}
        onClick={onIncrease}
        aria-label={incrementAriaLabel}
      >
        +
      </button>
    </div>
  );
}
