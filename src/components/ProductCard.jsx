import { ArrowRight } from 'lucide-react';
import { formatPrice, getStartingPrice } from '../data/productStore.js';
import { productHref } from '../routing/sitePaths.js';
import ProductImage from './ProductImage.jsx';

export default function ProductCard({ product }) {
  return <a href={productHref(product.slug)} className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(7,27,43,.05)] transition duration-300 hover:-translate-y-1.5 hover:border-[#17c964]/50 hover:shadow-[0_18px_45px_rgba(7,27,43,.1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#17c964]/25"><ProductImage product={product} compact /><div className="p-5 sm:p-6"><h3 className="text-xl font-black tracking-[-0.035em] text-[#071b2b]">{product.name}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">{product.description}</p><p className="mt-5 text-sm font-bold text-[#11984b]">{formatPrice(getStartingPrice(product))}'den başlayan fiyatlarla</p><span className="mt-5 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#071b2b] px-4 py-2.5 text-sm font-extrabold text-white transition group-hover:bg-[#17c964] group-hover:text-[#061c13]">Ürünü İncele <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></span></div></a>;
}

