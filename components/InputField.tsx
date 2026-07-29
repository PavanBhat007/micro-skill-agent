type InputFieldProps = {
  name: string;
  label: string;
  type?: string;
}

export default function InputField({name, label, type="text"}: InputFieldProps) {
  return (
    <div className="w-full max-w-2xl">
      <label htmlFor={name} className="font-semibold text-gray-900 py-1 -mb-14">{label}</label>
      <input type={type} name={name} className="w-full border border-orange-300 rounded px-4 py-2 outline-0 focus:outline-1 focus:outline-orange-400" />
    </div>
  )
}