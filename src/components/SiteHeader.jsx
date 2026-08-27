import { MessageCircle, Printer } from 'lucide-react';
import { createWhatsAppUrl } from '../config/contact.js';
import { homeHref, productsHref } from '../routing/sitePaths.js';

export function Logo({ dark = true }) {
  return <a href={homeHref} className="group flex items-center gap-2.5" aria-label="YapyapMatbaa ana sayfa"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#17c964] text-[#071b2b] shadow-[0_7px_20px_rgba(23,201,100,.24)] transition-transform group-hover:-rotate-3"><Printer size={21} strokeWidth={2.4} /></span><span className={`text-[17px] font-extrabold tracking-[-0.04em] ${dark ? 'text-white' : 'text-[#071b2b]'}`}>yapyap<span className="text-[#17c964]">matbaa</span></span></a>;
}

export default function SiteHeader({ solid = false }) {
  return <header className={`${solid ? 'relative bg-[#071b2b]' : 'absolute'} inset-x-0 top-0 z-30`}><div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-8"><Logo /><nav className="hidden items-center gap-8 text-sm font-semibold text-white/70 md:flex" aria-label="Ana menü"><a className="transition-colors hover:text-white" href={productsHref}>Ürünler</a><a className="transition-colors hover:text-white" href={`${homeHref}#surec`}>Nasıl çalışır?</a><a className="transition-colors hover:text-white" href={`${homeHref}#iletisim`}>İletişim</a></nav><a href={createWhatsAppUrl()} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2.5 text-xs font-bold text-white backdrop-blur transition hover:bg-white/15 sm:px-4 sm:text-sm"><MessageCircle size={17} /> <span className="hidden min-[380px]:inline">WhatsApp</span></a></div></header>;
}

