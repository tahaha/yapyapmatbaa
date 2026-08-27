import { ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import ProductDetail from '../components/ProductDetail.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';
import { useProducts } from '../hooks/useProducts.js';
import { homeHref, productsHref } from '../routing/sitePaths.js';

export default function ProductDetailPage({ slug }) {
  const product = useProducts().find((item) => item.slug === slug && item.active);
  useEffect(() => { document.title = product ? `${product.name} | YapyapMatbaa` : 'Ürün Bulunamadı | YapyapMatbaa'; }, [product]);
  if (!product) return <main className="min-h-screen bg-[#f6f8f7]"><SiteHeader solid /><div className="mx-auto max-w-3xl px-5 py-24 text-center"><h1 className="text-4xl font-black text-[#071b2b]">Ürün bulunamadı</h1><p className="mt-4 text-slate-500">Bu ürün pasif olabilir veya adresi değişmiş olabilir.</p><a href={productsHref} className="mt-7 inline-flex rounded-xl bg-[#17c964] px-5 py-3 font-extrabold text-[#061c13]">Ürünlere Dön</a></div><SiteFooter /></main>;
  return <main className="min-h-screen bg-[#f6f8f7] text-[#102331]"><SiteHeader solid /><section className="py-8 sm:py-12"><div className="mx-auto max-w-6xl px-5 sm:px-8"><nav className="mb-8 flex flex-wrap items-center gap-1.5 text-xs font-bold text-slate-400" aria-label="Breadcrumb"><a href={homeHref} className="hover:text-[#11984b]">Ana Sayfa</a><ChevronRight size={14} /><a href={productsHref} className="hover:text-[#11984b]">Ürünler</a><ChevronRight size={14} /><span className="text-[#11984b]">{product.name}</span></nav><ProductDetail product={product} /></div></section><SiteFooter /></main>;
}

