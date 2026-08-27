import { Image as ImageIcon } from 'lucide-react';
import { assetHref } from '../routing/sitePaths.js';

export default function ProductImage({ product, variant, compact = false }) {
  const image = variant?.image || product.image;
  return <div className={`group relative overflow-hidden bg-[#e8efeb] ${compact ? 'aspect-[4/3] rounded-t-[1.45rem]' : 'aspect-[4/3] rounded-[2rem] lg:aspect-square'}`}><img src={assetHref(image)} alt={`${product.name} mockup görseli`} className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.03]" /><div className="absolute inset-0 bg-gradient-to-t from-[#071b2b]/80 via-transparent to-transparent" /><div className="absolute bottom-0 left-0 p-5 text-white sm:p-7"><span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#17c964] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#071b2b]"><ImageIcon size={12} /> Mockup</span><p className={`${compact ? 'text-xl' : 'text-3xl sm:text-4xl'} font-black tracking-[-0.04em]`}>{variant?.model || product.name}</p></div></div>;
}

