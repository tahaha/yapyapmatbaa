import { ChevronRight, PackageSearch } from 'lucide-react';
import { useEffect } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';
import { useProducts } from '../hooks/useProducts.js';
import { homeHref } from '../routing/sitePaths.js';

export default function ProductsPage() {
  const products = useProducts().filter((product) => product.active);
  useEffect(() => { document.title = 'Ürünler | YapyapMatbaa'; }, []);
  return <main className="min-h-screen bg-[#f6f8f7] text-[#102331]"><SiteHeader solid /><section className="bg-[#071b2b] pb-16 pt-12 text-white sm:pb-20 sm:pt-16"><div className="mx-auto max-w-6xl px-5 sm:px-8"><nav className="flex items-center gap-1.5 text-xs font-bold text-slate-400" aria-label="Breadcrumb"><a href={homeHref} className="hover:text-white">Ana Sayfa</a><ChevronRight size={14} /><span className="text-[#54e98f]">Ürünler</span></nav><p className="mt-8 text-xs font-black uppercase tracking-[.18em] text-[#54e98f]">Baskı çözümleri</p><h1 className="mt-3 max-w-3xl text-4xl font-black tracking-[-0.05em] sm:text-6xl">Markanıza uygun ürünü seçin.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Ebat, adet ve üretim seçeneklerini ürün sayfasında belirleyin; fiyatınız anında güncellensin.</p></div></section><section className="py-14 sm:py-20"><div className="mx-auto max-w-6xl px-5 sm:px-8"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>{products.length === 0 && <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><PackageSearch className="mx-auto text-slate-300" size={38} /><p className="mt-4 font-extrabold">Aktif ürün bulunmuyor.</p></div>}</div></section><SiteFooter /></main>;
}

