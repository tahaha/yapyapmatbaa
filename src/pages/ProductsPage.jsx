import { ChevronRight, PackageSearch } from 'lucide-react';
import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';
import { getActiveCategories } from '../data/categoryStore.js';
import { useProducts } from '../hooks/useProducts.js';
import { homeHref } from '../routing/sitePaths.js';

export default function ProductsPage() {
  const products = useProducts().filter((product) => product.active);
  const categories = getActiveCategories();
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    document.title = 'Urunler | YapyapMatbaa';
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.categoryId === selectedCategory || p.category === categories.find((c) => c.id === selectedCategory)?.name);

  return (
    <main className="min-h-screen bg-[#f6f8f7] text-[#102331]">
      <SiteHeader solid />

      {/* Baslik */}
      <section className="bg-[#071b2b] pb-16 pt-12 text-white sm:pb-20 sm:pt-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <nav className="flex items-center gap-1.5 text-xs font-bold text-slate-400" aria-label="Breadcrumb">
            <a href={homeHref} className="hover:text-white">Ana Sayfa</a>
            <ChevronRight size={14} />
            <span className="text-[#54e98f]">Urunler</span>
          </nav>
          <p className="mt-8 text-xs font-black uppercase tracking-[.18em] text-[#54e98f]">Baski cozumleri</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-[-0.05em] sm:text-6xl">
            Markaniza uygun urunu secin.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Ebat, adet ve uretim seceneklerini urun sayfasinda belirleyin; fiyatiniz aninda guncellensin.
          </p>
        </div>
      </section>

      {/* Urunler */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          {/* Kategori filtresi */}
          {categories.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  selectedCategory === 'all'
                    ? 'bg-[#17c964] text-[#061c13]'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-[#17c964] hover:text-[#11984b]'
                }`}
              >
                Tumu
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    selectedCategory === cat.id
                      ? 'bg-[#17c964] text-[#061c13]'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-[#17c964] hover:text-[#11984b]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <PackageSearch className="mx-auto text-slate-300" size={38} />
              <p className="mt-4 font-extrabold">
                {selectedCategory === 'all' ? 'Aktif urun bulunmuyor.' : 'Bu kategoride urun bulunmuyor.'}
              </p>
              {selectedCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="mt-3 text-sm font-extrabold text-[#11984b] hover:text-[#071b2b]"
                >
                  Tum urunleri goster
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
