import { ArrowRight, BadgeCheck, Check, MessageCircle, Palette, Send, Sparkles, Truck } from 'lucide-react';
import CampaignSection from './components/CampaignSection.jsx';
import FeaturedSection from './components/FeaturedSection.jsx';
import ProductCard from './components/ProductCard.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import SiteHeader from './components/SiteHeader.jsx';
import { useSiteContent } from './hooks/useSiteContent.js';
import { useProducts } from './hooks/useProducts.js';
import { productsHref } from './routing/sitePaths.js';

const stepIcons = [MessageCircle, Palette, Truck];
const stepNumbers = ['01', '02', '03'];

export default function Home() {
  const products = useProducts().filter((product) => product.active);
  const content = useSiteContent();

  const whatsappUrl = `https://wa.me/${content.contact.whatsappNumber}?text=${encodeURIComponent('Merhaba, YapyapMatbaa web sitenizden ulaşıyorum. Baskı hizmetleriniz hakkında bilgi almak istiyorum.')}`;

  return (
    <main id="top" className="min-h-screen overflow-hidden bg-[#f6f8f7] text-[#102331]">
      <SiteHeader />

      {/* Hero */}
      <section className="hero-grid relative bg-[#071b2b] pb-20 pt-32 text-white sm:pb-24 sm:pt-40">
        <div className="hero-glow absolute right-[-15%] top-[10%] h-[420px] w-[420px] rounded-full" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-20">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#54e98f]/25 bg-[#17c964]/10 px-3.5 py-2 text-xs font-bold text-[#75f0a5] sm:text-sm">
              <Sparkles size={16} /> {content.hero.badge}
            </div>
            <h1 className="text-[2.55rem] font-black leading-[1.05] tracking-[-0.055em] sm:text-6xl lg:text-[4.35rem]">
              {content.hero.title.includes('Akılda Kalıcı') ? (
                <>
                  {content.hero.title.split('Akılda Kalıcı')[0]}
                  <span className="text-[#54e98f]">Akılda Kalıcı</span>
                  {content.hero.title.split('Akılda Kalıcı')[1]}
                </>
              ) : (
                content.hero.title
              )}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl">
              {content.hero.description}
            </p>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="cta-shine group flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#17c964] px-6 py-4 text-base font-extrabold text-[#061c13] shadow-[0_14px_35px_rgba(23,201,100,.28)] transition duration-300 hover:-translate-y-1 hover:bg-[#21d970] sm:w-auto"
              >
                <MessageCircle size={22} />{content.hero.ctaButton}
                <ArrowRight size={19} className="transition-transform group-hover:translate-x-1" />
              </a>
              <span className="flex items-center gap-2 text-sm font-medium text-slate-400">
                <Check size={17} className="text-[#54e98f]" /> Hızlı yanıt · Ücretsiz teklif
              </span>
            </div>
          </div>
          <div className="relative mx-auto hidden w-full max-w-[430px] lg:block" aria-hidden="true">
            <div className="absolute -inset-5 rotate-3 rounded-[2.3rem] border border-dashed border-[#54e98f]/25" />
            <div className="relative rounded-[2rem] border border-white/10 bg-white/[.065] p-5 shadow-2xl backdrop-blur">
              <div className="rounded-[1.4rem] bg-[#edf1ee] p-6 text-[#102331]">
                <div className="mb-10 flex items-start justify-between">
                  <div>
                    <div className="mb-2 h-2.5 w-14 rounded-full bg-[#17c964]" />
                    <p className="text-2xl font-black tracking-[-0.04em]">
                      İyi tasarım,<br />iyi bir iz bırakır.
                    </p>
                  </div>
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[#071b2b] text-white">
                    <Sparkles size={19} />
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <Palette className="mb-5 text-[#17a755]" size={24} />
                    <p className="text-sm font-extrabold">Özgün<br />tasarım</p>
                  </div>
                  <div className="rounded-2xl bg-[#17c964] p-4">
                    <BadgeCheck className="mb-5" size={24} />
                    <p className="text-sm font-extrabold">Kaliteli<br />baskı</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kampanyalar */}
      <CampaignSection />

      {/* Öne Çıkan Ürünler */}
      <FeaturedSection products={products} />

      {/* Ürünlerimiz / Hizmetler */}
      <section id="hizmetler" className="scroll-mt-8 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-14 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[.18em] text-[#11984b]">{content.services.badge}</p>
              <h2 className="text-3xl font-black tracking-[-0.045em] text-[#071b2b] sm:text-5xl">{content.services.title}</h2>
            </div>
            <div className="sm:text-right">
              <p className="max-w-md text-sm leading-relaxed text-slate-500">
                {content.services.description}
              </p>
              <a href={productsHref} className="mt-3 inline-flex items-center gap-1.5 text-sm font-extrabold text-[#11984b] hover:text-[#071b2b]">
                Tüm ürünleri gör <ArrowRight size={16} />
              </a>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Nasıl Çalışıyoruz */}
      <section id="surec" className="scroll-mt-8 bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-xs font-black uppercase tracking-[.18em] text-[#11984b]">{content.howItWorks.badge}</p>
            <h2 className="text-3xl font-black tracking-[-0.045em] text-[#071b2b] sm:text-5xl">{content.howItWorks.title}</h2>
            <p className="mt-4 text-slate-500">{content.howItWorks.description}</p>
          </div>
          <div className="relative grid gap-5 md:grid-cols-3">
            <div className="absolute left-[16%] right-[16%] top-10 hidden border-t border-dashed border-[#17c964]/40 md:block" />
            {content.howItWorks.steps.map((step, i) => {
              const Icon = stepIcons[i] || MessageCircle;
              return (
                <article key={i} className="relative rounded-3xl border border-slate-100 bg-[#f8faf9] p-6 sm:p-7">
                  <div className="relative mb-7 flex items-center justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#071b2b] text-[#54e98f] shadow-lg">
                      <Icon size={25} />
                    </span>
                    <span className="text-4xl font-black tracking-[-0.07em] text-slate-200">{stepNumbers[i] || String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="text-xl font-extrabold tracking-[-0.025em] text-[#071b2b]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="bg-[#071b2b] pt-20 text-white sm:pt-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="overflow-hidden rounded-[2rem] bg-[#0c293b] p-6 sm:p-10 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[#54e98f]">
                  <BadgeCheck size={18} /> {content.cta.badge}
                </div>
                <h2 className="max-w-2xl text-3xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">
                  {content.cta.title}
                </h2>
                <p className="mt-4 max-w-xl leading-relaxed text-slate-300">
                  {content.cta.description}
                </p>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#17c964] px-6 py-4 font-extrabold text-[#061c13] transition hover:-translate-y-1 hover:bg-[#21d970]"
              >
                <Send size={20} /> {content.cta.ctaButton} <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />

      {/* Mobil WhatsApp FAB */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp'tan bilgi al"
        className="fixed bottom-4 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#17c964] text-[#061c13] shadow-[0_10px_30px_rgba(0,0,0,.25)] transition hover:scale-105 sm:hidden"
      >
        <MessageCircle size={26} />
      </a>
    </main>
  );
}
