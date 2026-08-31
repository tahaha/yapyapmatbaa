import { Star, User } from 'lucide-react';
import { useReviews } from '../hooks/useReviews.js';

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? 'fill-[#17c964] text-[#17c964]' : 'text-slate-200'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const reviews = useReviews();

  if (reviews.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs font-black uppercase tracking-[.18em] text-[#11984b]">
            Müşteri Yorumları
          </p>
          <h2 className="text-3xl font-black tracking-[-0.045em] text-[#071b2b] sm:text-5xl">
            Müşterilerimiz ne diyor?
          </h2>
          <p className="mt-4 text-slate-500">
            Baskı kalitemiz ve hizmetimiz hakkında gerçek geri bildirimler.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="relative rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_rgba(7,27,43,.04)] transition hover:shadow-[0_16px_40px_rgba(7,27,43,.08)] sm:p-7"
            >
              {/* Tırnak ikonu */}
              <div className="mb-5 text-4xl font-black leading-none text-[#17c964]/20 select-none" aria-hidden="true">
                "
              </div>

              <p className="text-sm leading-7 text-slate-600">{review.text}</p>

              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                {review.avatar ? (
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="h-11 w-11 rounded-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#071b2b] text-[#54e98f]">
                    <User size={20} />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-extrabold text-[#102331]">{review.name}</p>
                  {review.company && (
                    <p className="mt-0.5 truncate text-xs text-slate-400">{review.company}</p>
                  )}
                </div>
                <div className="ml-auto shrink-0">
                  <StarRating rating={review.rating} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
