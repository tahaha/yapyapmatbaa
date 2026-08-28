import { ArrowRight, Clock, Flame, Tag } from 'lucide-react';
import { getActiveCampaigns } from '../data/campaignStore.js';
import { formatPrice } from '../data/productStore.js';
import { productHref } from '../routing/sitePaths.js';

function daysLeft(endDate) {
  if (!endDate) return null;
  const diff = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : null;
}

export default function CampaignSection() {
  const campaigns = getActiveCampaigns();
  if (campaigns.length === 0) return null;

  return (
    <section className="scroll-mt-8 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-10 sm:mb-14">
          <p className="mb-3 text-xs font-black uppercase tracking-[.18em] text-[#11984b]">Kampanyalar</p>
          <h2 className="text-3xl font-black tracking-[-0.045em] text-[#071b2b] sm:text-5xl">
            Kacirmak istemeyeceginiz firsatlar.
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((camp) => {
            const remaining = daysLeft(camp.endDate);
            const discount = camp.oldPrice > 0 ? Math.round(((camp.oldPrice - camp.campaignPrice) / camp.oldPrice) * 100) : 0;
            return (
              <article
                key={camp.id}
                className="group relative overflow-hidden rounded-3xl border border-[#17c964]/20 bg-gradient-to-br from-[#edf9f2] to-white shadow-[0_10px_35px_rgba(7,27,43,.05)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(7,27,43,.1)]"
              >
                {/* Badge */}
                {camp.badgeText && (
                  <span className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-[#17c964] px-3 py-1.5 text-xs font-extrabold text-[#061c13]">
                    <Flame size={13} /> {camp.badgeText}
                  </span>
                )}

                <div className="p-6 sm:p-7">
                  {/* Baslik */}
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#17c964]/15 text-[#11984b]">
                      <Tag size={19} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-lg font-black tracking-[-0.03em] text-[#071b2b]">{camp.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{camp.description}</p>
                    </div>
                  </div>

                  {/* Fiyat */}
                  <div className="mt-6 flex items-end gap-3">
                    <span className="text-3xl font-black tracking-[-0.04em] text-[#071b2b]">
                      {formatPrice(camp.campaignPrice)}
                    </span>
                    {camp.oldPrice > 0 && (
                      <span className="mb-0.5 text-lg font-bold text-slate-400 line-through">
                        {formatPrice(camp.oldPrice)}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="mb-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-extrabold text-red-500">
                        %{discount}
                      </span>
                    )}
                  </div>

                  {/* Kalan sure */}
                  {remaining && (
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Clock size={13} className="text-[#11984b]" />
                      <span>Son {remaining} gun</span>
                    </div>
                  )}

                  {/* Detay butonu */}
                  {camp.productSlug && (
                    <a
                      href={productHref(camp.productSlug)}
                      className="mt-6 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#071b2b] px-4 py-2.5 text-sm font-extrabold text-white transition group-hover:bg-[#17c964] group-hover:text-[#061c13]"
                    >
                      Detaylari Gor <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
