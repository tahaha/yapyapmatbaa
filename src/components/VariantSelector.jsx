export default function VariantSelector({ label, options, value, onChange }) {
  if (options.length <= 1) return null;
  return <fieldset><legend className="mb-2.5 text-sm font-extrabold text-[#102331]">{label}</legend><div className="flex flex-wrap gap-2">{options.map((option) => <button key={String(option)} type="button" onClick={() => onChange(option)} className={`min-h-11 rounded-xl border px-3.5 py-2.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#17c964]/20 ${value === option ? 'border-[#17c964] bg-[#edf9f2] text-[#087a3a]' : 'border-slate-200 bg-white text-slate-600 hover:border-[#17c964]/60'}`}>{typeof option === 'number' ? new Intl.NumberFormat('tr-TR').format(option) : option}</button>)}</div></fieldset>;
}

