import { useEffect, useRef, useState } from 'react';
import { ArrowRight, BadgeCheck, Check, ChevronRight, CreditCard, FileText, Layers3, MapPin, MessageCircle, PackageCheck, Palette, Phone, Printer, Ruler, Send, Sparkles, Sticker, Truck, X } from 'lucide-react';
import { formatPrice } from './data/productStore.js';
import { useProducts } from './hooks/useProducts.js';

const whatsappNumber = '905431109543';
const generalMessage = 'Merhaba, YapyapMatbaa web sitenizden ulaşıyorum. Baskı hizmetleriniz hakkında bilgi almak istiyorum.';
const createWhatsAppUrl = (message) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
const generalWhatsAppUrl = createWhatsAppUrl(generalMessage);

const steps = [
  { number: '01', title: 'Bize ulaşın', text: 'WhatsApp’tan bize ulaşın ve bilgilerinizi gönderin.', icon: MessageCircle },
  { number: '02', title: 'Tasarımı onaylayın', text: 'Ücretsiz tasarım desteğimizle taslağınızı hazırlayıp onayınıza sunalım.', icon: Palette },
  { number: '03', title: 'Kapınıza gelsin', text: 'Hızlıca baskıya alıp kargo ile size ulaştıralım.', icon: Truck },
];

function Logo() {
  return <a href="#top" className="group flex items-center gap-2.5" aria-label="Yapyapmatbaa ana sayfa"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#17c964] text-[#071b2b] shadow-[0_7px_20px_rgba(23,201,100,.24)] transition-transform group-hover:-rotate-3"><Printer size={21} strokeWidth={2.4} /></span><span className="text-[17px] font-extrabold tracking-[-0.04em] text-white">yapyap<span className="text-[#54e98f]">matbaa</span></span></a>;
}

function getProductIcon(product) {
  const category = product.category.toLocaleLowerCase('tr-TR');
  if (category.includes('kartvizit')) return CreditCard;
  if (category.includes('etiket')) return Sticker;
  if (category.includes('broşür') || category.includes('brosur')) return FileText;
  return PackageCheck;
}

export default function Home() {
  const products = useProducts();
  const activeProducts = products.filter((product) => product.active);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const detailsRef = useRef(null);
  const selectedProduct = activeProducts.find((product) => product.id === selectedProductId) ?? null;

  useEffect(() => {
    if (selectedProduct) {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedProduct]);

  const productWhatsAppUrl = selectedProduct
    ? createWhatsAppUrl(`Merhaba, YapyapMatbaa web sitenizden ulaşıyorum. ${selectedProduct.quantity} adet ${selectedProduct.name} için fiyat teklifi almak istiyorum.`)
    : generalWhatsAppUrl;

  return <main id="top" className="min-h-screen overflow-hidden bg-[#f6f8f7] text-[#102331]">
    <header className="absolute inset-x-0 top-0 z-30"><div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-8"><Logo /><nav className="hidden items-center gap-8 text-sm font-semibold text-white/70 md:flex" aria-label="Ana menü"><a className="transition-colors hover:text-white" href="#hizmetler">Hizmetler</a><a className="transition-colors hover:text-white" href="#surec">Nasıl çalışır?</a><a className="transition-colors hover:text-white" href="#iletisim">İletişim</a></nav><a href={generalWhatsAppUrl} target="_blank" rel="noreferrer" className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15 sm:flex"><MessageCircle size={17} /> WhatsApp</a></div></header>

    <section className="hero-grid relative bg-[#071b2b] pb-20 pt-32 text-white sm:pb-24 sm:pt-40"><div className="hero-glow absolute right-[-15%] top-[10%] h-[420px] w-[420px] rounded-full" /><div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-20"><div className="max-w-3xl"><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#54e98f]/25 bg-[#17c964]/10 px-3.5 py-2 text-xs font-bold text-[#75f0a5] sm:text-sm"><Sparkles size={16} /> Tasarım Oluşturmak İçin Ücretsiz Tasarım Desteği!</div><h1 className="text-[2.55rem] font-black leading-[1.05] tracking-[-0.055em] sm:text-6xl lg:text-[4.35rem]">Markanızı Yansıtan, <span className="text-[#54e98f]">Akılda Kalıcı</span> Kartvizit ve Baskı Tasarımları</h1><p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl">Siz hayal edin, biz tasarlayıp kapınıza kadar gönderelim.</p><div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center"><a href={generalWhatsAppUrl} target="_blank" rel="noreferrer" className="cta-shine group flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#17c964] px-6 py-4 text-base font-extrabold text-[#061c13] shadow-[0_14px_35px_rgba(23,201,100,.28)] transition duration-300 hover:-translate-y-1 hover:bg-[#21d970] sm:w-auto"><MessageCircle size={22} strokeWidth={2.4} />Hemen WhatsApp’tan Bilgi Al<ArrowRight size={19} className="transition-transform group-hover:translate-x-1" /></a><span className="flex items-center gap-2 text-sm font-medium text-slate-400"><Check size={17} className="text-[#54e98f]" /> Hızlı yanıt · Ücretsiz teklif</span></div></div>
      <div className="relative mx-auto hidden w-full max-w-[430px] lg:block" aria-hidden="true"><div className="absolute -inset-5 rotate-3 rounded-[2.3rem] border border-dashed border-[#54e98f]/25" /><div className="relative rounded-[2rem] border border-white/10 bg-white/[.065] p-5 shadow-2xl backdrop-blur"><div className="rounded-[1.4rem] bg-[#edf1ee] p-6 text-[#102331]"><div className="mb-10 flex items-start justify-between"><div><div className="mb-2 h-2.5 w-14 rounded-full bg-[#17c964]" /><p className="text-2xl font-black tracking-[-0.04em]">İyi tasarım,<br />iyi bir iz bırakır.</p></div><span className="grid h-11 w-11 place-items-center rounded-full bg-[#071b2b] text-white"><Sparkles size={19} /></span></div><div className="grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white p-4 shadow-sm"><Palette className="mb-5 text-[#17a755]" size={24} /><p className="text-sm font-extrabold">Özgün<br />tasarım</p></div><div className="rounded-2xl bg-[#17c964] p-4"><Printer className="mb-5" size={24} /><p className="text-sm font-extrabold">Kaliteli<br />baskı</p></div></div></div><div className="flex items-center justify-between px-2 pb-1 pt-5 text-xs font-bold text-white/55"><span>YAPYAPMATBAA</span><span>İSTANBUL · 2026</span></div></div></div></div></section>

    <section id="hizmetler" className="scroll-mt-8 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-14 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[.18em] text-[#11984b]">Hizmetlerimiz</p>
            <h2 className="text-3xl font-black tracking-[-0.045em] text-[#071b2b] sm:text-5xl">Net fiyat, kaliteli baskı.</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-500 sm:text-right">Tüm ürünlerde tasarım desteği bizden. Fiyatlar 1000 adet üretim için geçerlidir. Detayları görmek için ürünü seçin.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeProducts.map((product) => {
            const Icon = getProductIcon(product);
            const isSelected = product.id === selectedProductId;
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => setSelectedProductId(product.id)}
                aria-expanded={isSelected}
                aria-controls="urun-detayi"
                className={`group relative w-full overflow-hidden rounded-3xl border bg-white p-6 text-left shadow-[0_10px_35px_rgba(7,27,43,.05)] transition duration-300 hover:-translate-y-1.5 hover:border-[#17c964]/50 hover:shadow-[0_18px_45px_rgba(7,27,43,.09)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#17c964]/25 ${isSelected ? 'border-[#17c964] ring-4 ring-[#17c964]/10' : 'border-slate-200/80'}`}
              >
                <div className="mb-7 flex items-start justify-between">
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl transition-colors ${isSelected ? 'bg-[#17c964] text-[#071b2b]' : 'bg-[#edf9f2] text-[#11984b] group-hover:bg-[#17c964] group-hover:text-[#071b2b]'}`}>
                    <Icon size={23} strokeWidth={2.2} />
                  </span>
                  <span className="rounded-full bg-[#f3f5f4] px-3 py-1.5 text-xs font-bold text-slate-500">{product.quantity} Adet</span>
                </div>
                <h3 className="pr-10 text-lg font-extrabold tracking-[-0.025em] text-[#102331]">{product.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{product.description}</p>
                <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-5">
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Başlangıç fiyatı</p>
                    <p className="mt-1 text-3xl font-black tracking-[-0.05em] text-[#071b2b]">{formatPrice(product.price)}</p>
                  </div>
                  <span aria-hidden="true" className={`grid h-10 w-10 place-items-center rounded-full transition ${isSelected ? 'rotate-90 bg-[#17c964] text-[#071b2b]' : 'bg-[#071b2b] text-white group-hover:bg-[#17c964] group-hover:text-[#071b2b]'}`}>
                    <ChevronRight size={20} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {activeProducts.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <PackageCheck className="mx-auto text-slate-300" size={34} />
            <h3 className="mt-4 text-lg font-extrabold text-[#102331]">Ürünler güncelleniyor</h3>
            <p className="mt-2 text-sm text-slate-500">Aktif ürünler kısa süre içinde burada görüntülenecek.</p>
          </div>
        )}

        {selectedProduct && (
          <article ref={detailsRef} id="urun-detayi" className="mt-6 overflow-hidden rounded-[2rem] border border-[#17c964]/25 bg-[#071b2b] text-white shadow-[0_22px_60px_rgba(7,27,43,.14)]">
            <div className="grid lg:grid-cols-[1.1fr_.9fr]">
              <div className="p-6 sm:p-9 lg:p-10">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="mb-3 text-xs font-black uppercase tracking-[.18em] text-[#54e98f]">Ürün detayı</p>
                    <h3 className="text-2xl font-black tracking-[-0.04em] sm:text-4xl">{selectedProduct.name}</h3>
                  </div>
                  <button type="button" onClick={() => setSelectedProductId(null)} aria-label="Ürün detayını kapat" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#54e98f]">
                    <X size={19} />
                  </button>
                </div>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{selectedProduct.description}</p>
                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[.055] p-4">
                    <p className="text-xs font-semibold text-slate-400">Fiyat</p>
                    <p className="mt-1 text-xl font-black text-[#54e98f]">{formatPrice(selectedProduct.price)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[.055] p-4">
                    <p className="text-xs font-semibold text-slate-400">Adet</p>
                    <p className="mt-1 text-xl font-black">{selectedProduct.quantity}</p>
                  </div>
                  <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[.055] p-4 sm:col-span-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400"><Ruler size={14} /> Ölçü</div>
                    <p className="mt-1 text-lg font-black">{selectedProduct.size}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 bg-[#0c293b] p-6 sm:p-9 lg:border-l lg:border-t-0 lg:p-10">
                <div className="mb-5 flex items-center gap-2 text-sm font-extrabold text-[#54e98f]"><Layers3 size={18} /> Baskı özellikleri</div>
                <ul className="space-y-3">
                  {selectedProduct.printFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-slate-200">
                      <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#17c964]/15 text-[#54e98f]"><Check size={13} strokeWidth={3} /></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a href={productWhatsAppUrl} target="_blank" rel="noreferrer" className="group mt-8 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#17c964] px-5 py-4 text-center font-extrabold text-[#061c13] shadow-[0_14px_35px_rgba(23,201,100,.2)] transition hover:-translate-y-1 hover:bg-[#21d970]">
                  <MessageCircle size={21} strokeWidth={2.4} /> WhatsApp’tan Teklif Al <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </a>
                <p className="mt-3 text-center text-xs leading-5 text-slate-400">Ürün adı ve adet mesajınıza otomatik olarak eklenir.</p>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>

    <section id="surec" className="scroll-mt-8 bg-white py-20 sm:py-28"><div className="mx-auto max-w-6xl px-5 sm:px-8"><div className="mx-auto mb-12 max-w-2xl text-center"><p className="mb-3 text-xs font-black uppercase tracking-[.18em] text-[#11984b]">Süreç</p><h2 className="text-3xl font-black tracking-[-0.045em] text-[#071b2b] sm:text-5xl">Nasıl çalışıyoruz?</h2><p className="mt-4 text-slate-500">Fikirden teslimata, yalnızca üç kolay adım.</p></div><div className="relative grid gap-5 md:grid-cols-3"><div className="absolute left-[16%] right-[16%] top-10 hidden border-t border-dashed border-[#17c964]/40 md:block" />{steps.map((step) => { const Icon = step.icon; return <article key={step.number} className="relative rounded-3xl border border-slate-100 bg-[#f8faf9] p-6 sm:p-7"><div className="relative mb-7 flex items-center justify-between"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#071b2b] text-[#54e98f] shadow-lg"><Icon size={25} /></span><span className="text-4xl font-black tracking-[-0.07em] text-slate-200">{step.number}</span></div><h3 className="text-xl font-extrabold tracking-[-0.025em] text-[#071b2b]">{step.title}</h3><p className="mt-3 text-sm leading-6 text-slate-500">{step.text}</p></article>; })}</div></div></section>

    <section id="iletisim" className="bg-[#071b2b] py-20 text-white sm:py-24"><div className="mx-auto max-w-6xl px-5 sm:px-8"><div className="overflow-hidden rounded-[2rem] bg-[#0c293b] p-6 sm:p-10 lg:p-12"><div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center"><div><div className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[#54e98f]"><BadgeCheck size={18} /> Tasarım desteği ücretsiz</div><h2 className="max-w-2xl text-3xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">Markanızı baskıda öne çıkarmaya hazır mısınız?</h2><p className="mt-4 max-w-xl leading-relaxed text-slate-300">İhtiyacınızı anlatın, size en uygun ürün ve tasarım için hızlıca yardımcı olalım.</p></div><a href={generalWhatsAppUrl} target="_blank" rel="noreferrer" className="group flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#17c964] px-6 py-4 font-extrabold text-[#061c13] transition hover:-translate-y-1 hover:bg-[#21d970]"><Send size={20} /> Teklif İste <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></a></div></div>
      <div className="mt-12 grid gap-8 border-b border-white/10 pb-12 md:grid-cols-3"><div className="flex gap-3"><MapPin className="mt-0.5 shrink-0 text-[#54e98f]" size={20} /><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Üretim yeri</p><p className="mt-1.5 font-bold">İstanbul / Zeytinburnu</p></div></div><div className="flex gap-3"><Phone className="mt-0.5 shrink-0 text-[#54e98f]" size={20} /><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">İletişim</p><a href="tel:+905431109543" className="mt-1.5 block font-bold transition hover:text-[#54e98f]">0543 110 9543</a></div></div><div className="flex gap-3"><Truck className="mt-0.5 shrink-0 text-[#54e98f]" size={20} /><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Kargo bilgisi</p><p className="mt-1.5 text-sm leading-6 text-slate-300">Diğer illere gönderimlerde her ürün için ortalama 100 TL kargo ücreti bulunmaktadır.</p></div></div></div>
      <footer className="flex flex-col items-center justify-between gap-5 pt-8 text-center sm:flex-row sm:text-left"><Logo /><p className="text-xs text-slate-500">© 2026 Yapyapmatbaa. Tüm hakları saklıdır.</p></footer></div></section>

    <a href={generalWhatsAppUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp'tan bilgi al" className="fixed bottom-4 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#17c964] text-[#061c13] shadow-[0_10px_30px_rgba(0,0,0,.25)] transition hover:scale-105 sm:hidden"><MessageCircle size={26} strokeWidth={2.4} /></a>
  </main>;
}
