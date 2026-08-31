import { MapPin, Phone, Truck } from 'lucide-react';
import { Logo } from './SiteHeader.jsx';
import { useSiteContent } from '../hooks/useSiteContent.js';

export default function SiteFooter() {
  const content = useSiteContent();

  return <footer id="iletisim" className="bg-[#071b2b] text-white"><div className="mx-auto max-w-6xl px-5 py-12 sm:px-8"><div className="grid gap-8 border-b border-white/10 pb-10 md:grid-cols-3"><div className="flex gap-3"><MapPin className="mt-0.5 shrink-0 text-[#54e98f]" size={20} /><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Üretim yeri</p><p className="mt-1.5 font-bold">{content.contact.productionLocation}</p></div></div><div className="flex gap-3"><Phone className="mt-0.5 shrink-0 text-[#54e98f]" size={20} /><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">İletişim</p><a href={content.contact.phoneHref} className="mt-1.5 block font-bold transition hover:text-[#54e98f]">{content.contact.phone}</a></div></div><div className="flex gap-3"><Truck className="mt-0.5 shrink-0 text-[#54e98f]" size={20} /><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Kargo bilgisi</p><p className="mt-1.5 text-sm leading-6 text-slate-300">{content.contact.shippingInfo}</p></div></div></div><div className="flex flex-col items-center justify-between gap-5 pt-8 text-center sm:flex-row sm:text-left"><Logo /><p className="text-xs text-slate-500">{content.footer.copyright}</p></div></div></footer>;
}
