import { Check, FileCheck2, MessageCircle, Palette, Ruler } from 'lucide-react';
import { useMemo, useState } from 'react';
import { createWhatsAppUrl } from '../config/contact.js';
import { formatPrice } from '../data/productStore.js';
import ProductImage from './ProductImage.jsx';
import VariantSelector from './VariantSelector.jsx';

const selectorFields = [
  ['model', 'Kartvizit Modeli'], ['size', 'Ebat'], ['quantity', 'Adet'], ['finish', 'Yüzey'], ['cut', 'Kesim'],
];

const uniqueValues = (variants, field) => [...new Set(variants.map((variant) => variant[field]).filter((value) => value !== undefined && value !== ''))];

export default function ProductDetail({ product }) {
  const [variant, setVariant] = useState(product.variants[0]);
  const [designChoice, setDesignChoice] = useState('design-support');
  const selectors = useMemo(() => (product.slug === 'kartvizit' ? selectorFields.slice(0, 1) : selectorFields.slice(1)).map(([field, label]) => ({ field, label, options: uniqueValues(product.variants, field) })), [product]);

  const selectVariant = (field, value) => {
    const otherFields = selectors.filter((selector) => selector.field !== field && selector.options.length > 1).map((selector) => selector.field);
    const exact = product.variants.find((candidate) => candidate[field] === value && otherFields.every((other) => candidate[other] === variant[other]));
    setVariant(exact || product.variants.find((candidate) => candidate[field] === value) || variant);
  };

  const designText = designChoice === 'file-ready' ? 'Dosyam hazır' : 'Tasarım desteği istiyorum';
  const messageLines = [
    'Merhaba, YapyapMatbaa üzerinden fiyat almak istiyorum.', '',
    `Ürün: ${product.name}`,
    variant.model && `Model: ${variant.model}`,
    `Ebat: ${variant.size}`,
    `Adet: ${new Intl.NumberFormat('tr-TR').format(variant.quantity)}`,
    `Kağıt: ${variant.paper}`,
    `Baskı: ${variant.printing}`,
    variant.finish && `Yüzey: ${variant.finish}`,
    variant.cut && `Kesim: ${variant.cut}`,
    `Fiyat: ${formatPrice(variant.price)}`,
    `Tasarım: ${designText}`,
  ].filter(Boolean).join('\n');

  const specs = [
    ['Baskı', variant.printing], ['Kağıt', variant.paper], ['Ebat', variant.size],
    ['Adet', new Intl.NumberFormat('tr-TR').format(variant.quantity)], ['Yüzey', variant.finish], ['Kesim', variant.cut],
  ].filter(([, value]) => value);

  return <div className="grid gap-8 lg:grid-cols-[1.02fr_.98fr] lg:gap-12"><div><ProductImage product={product} variant={variant} /><div className="mt-5 hidden grid-cols-3 gap-3 sm:grid">{product.features?.map((feature) => <div key={feature} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-600"><Check size={15} className="shrink-0 text-[#17c964]" />{feature}</div>)}</div></div><div className="min-w-0"><p className="text-xs font-black uppercase tracking-[.18em] text-[#11984b]">{product.category}</p><h1 className="mt-2 text-4xl font-black tracking-[-0.05em] text-[#071b2b] sm:text-5xl">{product.name}</h1><p className="mt-4 leading-7 text-slate-500">{product.description}</p><div className="mt-7 space-y-5">{selectors.map((selector) => <VariantSelector key={selector.field} label={selector.label} options={selector.options} value={variant[selector.field]} onChange={(value) => selectVariant(selector.field, value)} />)}</div><div className="mt-7 rounded-3xl bg-[#071b2b] p-5 text-white sm:p-6"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Seçiminize göre fiyat</p><p className="mt-1 text-4xl font-black tracking-[-0.05em] text-[#54e98f]">{formatPrice(variant.price)}</p><p className="mt-2 text-xs leading-5 text-slate-400">Kargo ücreti teslimat iline göre ayrıca hesaplanır.</p></div><div className="mt-6 grid grid-cols-2 gap-3">{specs.map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1.5 text-sm font-extrabold leading-5 text-[#102331]">{value}</p></div>)}</div></div><section className="lg:col-span-2 rounded-[2rem] border border-[#17c964]/25 bg-[#edf9f2] p-5 sm:p-8"><div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end"><div><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#17c964] text-[#071b2b]"><Palette size={23} /></span><h2 className="mt-5 text-2xl font-black tracking-[-0.035em] text-[#071b2b]">Ücretsiz Tasarım Desteği</h2><p className="mt-2 text-sm leading-6 text-slate-600">Tasarımınız hazır değil mi? Siparişinizle birlikte ücretsiz tasarım desteği alın.</p><div className="mt-5 flex flex-col gap-2 sm:flex-row">{[['file-ready', 'Dosyam Hazır', FileCheck2], ['design-support', 'Tasarım Desteği İstiyorum', Palette]].map(([value, label, Icon]) => <button key={value} type="button" onClick={() => setDesignChoice(value)} className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-extrabold transition ${designChoice === value ? 'border-[#17c964] bg-white text-[#087a3a] shadow-sm' : 'border-transparent bg-[#dfece5] text-slate-600 hover:bg-white'}`}><Icon size={18} />{label}</button>)}</div></div><a href={createWhatsAppUrl(messageLines)} target="_blank" rel="noreferrer" className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#17c964] px-6 py-4 font-extrabold text-[#061c13] shadow-[0_12px_28px_rgba(23,201,100,.25)] transition hover:-translate-y-1 hover:bg-[#21d970] lg:w-auto"><MessageCircle size={21} /> WhatsApp'tan Sipariş Ver</a></div></section></div>;
}
