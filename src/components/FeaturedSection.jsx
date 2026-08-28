import { Award } from 'lucide-react';
import ProductCard from './ProductCard.jsx';

export default function FeaturedSection({ products }) {
  const featured = products.filter((p) => p.active && (p.featured || p.bestSeller));
  if (featured.length === 0) return null;

  return (
    <section className="scroll-mt-8 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-14 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Award size={18} className="text-[#11984b]" />
              <p className="text-xs font-black uppercase tracking-[.18em] text-[#11984b]">One Cikan Urunler</p>
            </div>
            <h2 className="text-3xl font-black tracking-[-0.045em] text-[#071b2b] sm:text-5xl">
              En cok tercih edilenler.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-500 sm:text-right">
            Musterilerimizin en cok talep ettigi urunleri kesfet.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
