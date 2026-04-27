export default function CustomRadioButton({ checked, onChange, name, className = "", ...props }) {
  return (
    <input
      type="radio"
      name={name}
      className={`h-5 w-5 shrink-0 appearance-none rounded-full border-2 border-red-500 bg-clip-content p-[3px] checked:bg-red-500 focus:outline-none ${className}`.trim()}
      checked={checked}
      onChange={onChange}
      {...props}
    />
  );
}
