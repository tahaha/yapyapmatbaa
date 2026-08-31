import { useEffect, useState } from 'react';
import {
  FileText,
  AlertCircle,
  ArrowLeft,
  Award,
  BarChart3,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Download,
  Eye,
  EyeOff,
  Folder,
  Image,
  Instagram,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageSquare,
  Package,
  Pencil,
  Plus,
  Power,
  Printer,
  RotateCcw,
  Save,
  Star,
  Tag,
  Trash2,
  TrendingDown,
  TrendingUp,
  Truck,
  Users,
} from 'lucide-react';
import {
  adminSessionKey,
  adminUsername,
  isAdminConfigured,
  verifyAdminPassword,
} from './config/admin.js';
import {
  campaignRepository,
  getActiveCampaigns,
  getCampaigns,
  subscribeToCampaigns,
} from './data/campaignStore.js';
import {
  categoryRepository,
  getActiveCategories,
  getCategories,
  subscribeToCategories,
} from './data/categoryStore.js';
import { getPriceHistory, subscribeToPriceHistory } from './data/priceHistoryStore.js';
import {
  downloadProductsJs,
  formatPrice,
  getStartingPrice,
  hasLocalChanges,
  productRepository,
  slugify,
} from './data/productStore.js';
import {
  getSiteContent,
  saveSiteContentSection,
  subscribeToSiteContent,
} from './data/siteContentStore.js';
import {
  getReviews,
  reviewRepository,
  subscribeToReviews,
} from './data/reviewStore.js';
import {
  getInstagramPosts,
  getInstagramSettings,
  instagramRepository,
  saveInstagramSettings,
  subscribeToInstagram,
} from './data/instagramStore.js';
import { useProducts } from './hooks/useProducts.js';
import { productHref } from './routing/sitePaths.js';

// ---------------------------------------------------------------------------
// Stil sabitleri
// ---------------------------------------------------------------------------
const fieldClass =
  'mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#102331] outline-none transition placeholder:text-slate-400 focus:border-[#17c964] focus:ring-4 focus:ring-[#17c964]/10';

const labelClass = 'block text-sm font-bold text-[#102331]';

const btnPrimary =
  'flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#17c964] px-5 py-2.5 text-sm font-extrabold text-[#061c13] transition hover:bg-[#21d970]';

const btnSecondary =
  'min-h-11 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50';

// ---------------------------------------------------------------------------
// Bos varyant sablonu
// ---------------------------------------------------------------------------
const newVariant = () => ({
  id: `v-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  model: '',
  size: '',
  quantity: 1000,
  paper: '',
  printing: '',
  finish: '',
  cut: '',
  price: 0,
  image: '',
  active: true,
});

// ---------------------------------------------------------------------------
// Logo
// ---------------------------------------------------------------------------
function AdminLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#17c964] text-[#071b2b]">
        <Printer size={21} strokeWidth={2.4} />
      </span>
      <span className="text-[17px] font-extrabold tracking-[-0.04em] text-white">
        yapyap<span className="text-[#54e98f]">matbaa</span>
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Giris ekrani
// ---------------------------------------------------------------------------
function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const ok = username === adminUsername && (await verifyAdminPassword(password));
      if (ok) {
        sessionStorage.setItem(adminSessionKey, 'authenticated');
        onLogin();
      } else {
        setError('Kullanici adi veya sifre hatali.');
      }
    } catch {
      setError('Giris sirasinda bir hata olustu. Tarayici guvenlik politikasini kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdminConfigured) {
    return (
      <main className="hero-grid grid min-h-screen place-items-center bg-[#071b2b] px-5 py-10 text-white">
        <section className="w-full max-w-md rounded-[2rem] border border-red-400/20 bg-red-400/10 p-8 text-center">
          <AlertCircle className="mx-auto text-red-300" size={40} />
          <h1 className="mt-4 text-2xl font-black text-white">Admin Yapilandirilmamis</h1>
          <p className="mt-3 text-sm leading-6 text-red-200">
            <code className="rounded bg-red-400/20 px-1.5 py-0.5 font-mono">VITE_ADMIN_PASSWORD_HASH</code> ortam
            degiskeni ayarlanmamis. <br />
            Projenin kok dizinindeki <code className="rounded bg-red-400/20 px-1.5 py-0.5 font-mono">.env</code>{' '}
            dosyasini kontrol edin.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="hero-grid grid min-h-screen place-items-center bg-[#071b2b] px-5 py-10 text-white">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[.065] p-6 shadow-2xl backdrop-blur sm:p-9">
        <AdminLogo />
        <p className="mt-9 text-xs font-black uppercase tracking-[.18em] text-[#54e98f]">Yonetim paneli</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.045em]">Hos geldiniz</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">Urun ve fiyat bilgilerini yonetmek icin giris yapin.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-bold">
            Kullanici adi
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`${fieldClass} border-white/10 bg-white/10 text-white placeholder:text-slate-500 focus:border-[#17c964]`}
              autoComplete="username"
              required
            />
          </label>
          <label className="block text-sm font-bold">
            Sifre
            <span className="relative block">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${fieldClass} border-white/10 bg-white/10 pr-12 text-white placeholder:text-slate-500 focus:border-[#17c964]`}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Sifreyi gizle' : 'Sifreyi goster'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </span>
          </label>
          {error && (
            <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 px-3.5 py-3 text-sm text-red-200">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#17c964] px-5 py-3 font-extrabold text-[#061c13] transition hover:bg-[#21d970] disabled:opacity-60"
          >
            {loading ? 'Dogrulaniyor...' : <>Giris Yap <ChevronRight size={18} /></>}
          </button>
        </form>
        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          Bu panel istemci tarafi SHA-256 dogrulamasi kullanir. Gercek guvenlik icin backend gereklidir.
        </p>
      </section>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Tek varyant editoru
// ---------------------------------------------------------------------------
function VariantEditor({ variant, index, total, onChange, onDelete }) {
  const [expanded, setExpanded] = useState(index === 0);
  const update = (field, value) => onChange({ ...variant, [field]: value });

  return (
    <div className={`rounded-2xl border ${variant.active !== false ? 'border-slate-200 bg-slate-50' : 'border-dashed border-slate-200 bg-slate-50/60 opacity-70'}`}>
      <div
        className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 select-none"
        onClick={() => setExpanded((v) => !v)}
        role="button"
        aria-expanded={expanded}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 text-xs font-black text-slate-400">#{index + 1}</span>
          <span className="truncate font-extrabold text-[#102331]">{variant.model || 'Yeni Varyant'}</span>
          {variant.price > 0 && (
            <span className="shrink-0 text-sm font-bold text-[#11984b]">{formatPrice(variant.price)}</span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`text-xs font-bold ${variant.active !== false ? 'text-[#11984b]' : 'text-slate-400'}`}>
            {variant.active !== false ? 'Aktif' : 'Pasif'}
          </span>
          {total > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              aria-label="Varyanti sil"
              className="grid h-7 w-7 place-items-center rounded-lg border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={14} />
            </button>
          )}
          {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-200 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={labelClass}>
              Model / Isim
              <input value={variant.model} onChange={(e) => update('model', e.target.value)} className={fieldClass} placeholder="Standart Duz Kesim" />
            </label>
            <label className={labelClass}>
              Fiyat (TL)
              <input type="number" min="0" step="0.01" value={variant.price} onChange={(e) => update('price', e.target.value)} className={fieldClass} required />
            </label>
            <label className={labelClass}>
              Ebat
              <input value={variant.size} onChange={(e) => update('size', e.target.value)} className={fieldClass} placeholder="8,3 x 5,1 cm" />
            </label>
            <label className={labelClass}>
              Adet
              <input type="number" min="1" value={variant.quantity} onChange={(e) => update('quantity', e.target.value)} className={fieldClass} />
            </label>
            <label className={labelClass}>
              Kagit
              <input value={variant.paper} onChange={(e) => update('paper', e.target.value)} className={fieldClass} placeholder="350 gr Mat Kuse" />
            </label>
            <label className={labelClass}>
              Baski
              <input value={variant.printing} onChange={(e) => update('printing', e.target.value)} className={fieldClass} placeholder="On 4 Renk / Arka 4 Renk" />
            </label>
            <label className={labelClass}>
              Yuzey
              <input value={variant.finish} onChange={(e) => update('finish', e.target.value)} className={fieldClass} placeholder="Mat Selefon + Kabartma Lak" />
            </label>
            <label className={labelClass}>
              Kesim
              <input value={variant.cut} onChange={(e) => update('cut', e.target.value)} className={fieldClass} placeholder="Duz Kesim" />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              Varyant gorseli (opsiyonel)
              <input
                value={variant.image || ''}
                onChange={(e) => update('image', e.target.value)}
                className={fieldClass}
                placeholder="images/products/kartvizit-standart.webp"
              />
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:col-span-2">
              <input
                type="checkbox"
                checked={variant.active !== false}
                onChange={(e) => update('active', e.target.checked)}
                className="h-4 w-4 accent-[#17c964]"
              />
              <span>
                <span className="block text-sm font-extrabold text-[#102331]">Varyant aktif</span>
                <span className="mt-0.5 block text-xs text-slate-500">Pasif varyantlar musteri tarafinda gizlenir.</span>
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Urun formu (ekle / duzenle) — Guncellenms: kategori, featured, bestSeller, deliveryTime
// ---------------------------------------------------------------------------
function ProductForm({ product, onCancel, onSave }) {
  const categories = getActiveCategories();

  const [form, setForm] = useState(() => ({
    name: product?.name || '',
    category: product?.category || '',
    categoryId: product?.categoryId || '',
    description: product?.description || '',
    image: product?.image || '',
    active: product?.active !== false,
    featured: product?.featured === true,
    bestSeller: product?.bestSeller === true,
    deliveryTime: product?.deliveryTime || '2-3 Is Gunu',
  }));

  const [variants, setVariants] = useState(() =>
    product?.variants?.length
      ? product.variants.map((v) => ({ ...v, active: v.active !== false }))
      : [newVariant()],
  );

  useEffect(() => {
    setForm({
      name: product?.name || '',
      category: product?.category || '',
      categoryId: product?.categoryId || '',
      description: product?.description || '',
      image: product?.image || '',
      active: product?.active !== false,
      featured: product?.featured === true,
      bestSeller: product?.bestSeller === true,
      deliveryTime: product?.deliveryTime || '2-3 Is Gunu',
    });
    setVariants(
      product?.variants?.length
        ? product.variants.map((v) => ({ ...v, active: v.active !== false }))
        : [newVariant()],
    );
  }, [product]);

  const updateField = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const updateVariant = (index, updated) =>
    setVariants((vs) => vs.map((v, i) => (i === index ? updated : v)));
  const addVariant = () => setVariants((vs) => [...vs, newVariant()]);
  const removeVariant = (index) => setVariants((vs) => vs.filter((_, i) => i !== index));

  const handleCategoryChange = (catId) => {
    const cat = categories.find((c) => c.id === catId);
    updateField('categoryId', catId);
    if (cat) updateField('category', cat.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (variants.length === 0) {
      alert('En az bir varyant gereklidir.');
      return;
    }
    onSave({
      ...form,
      slug: product?.slug || slugify(form.name),
      variants: variants.map((v) => ({
        ...v,
        price: Number(v.price) || 0,
        quantity: Number(v.quantity) || 1,
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(7,27,43,.05)] sm:p-7">
      <h2 className="mb-5 text-lg font-black tracking-[-0.03em] text-[#071b2b]">Urun Bilgileri</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className={labelClass}>
          Urun adi
          <input value={form.name} onChange={(e) => updateField('name', e.target.value)} className={fieldClass} required />
        </label>
        <label className={labelClass}>
          Kategori
          <select
            value={form.categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className={fieldClass}
          >
            <option value="">Kategori secin...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          Aciklama
          <textarea rows={3} value={form.description} onChange={(e) => updateField('description', e.target.value)} className={fieldClass} required />
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          Urun gorseli yolu
          <input
            value={form.image}
            onChange={(e) => updateField('image', e.target.value)}
            className={fieldClass}
            placeholder="images/products/urun-adi.webp  veya  https://..."
          />
          <span className="mt-1 block text-xs text-slate-400">
            Gorsel dosyasini <code className="rounded bg-slate-100 px-1 font-mono">public/images/products/</code> klasorune ekleyin.
          </span>
        </label>
        <label className={labelClass}>
          Tahmini Teslim Suresi
          <input
            value={form.deliveryTime}
            onChange={(e) => updateField('deliveryTime', e.target.value)}
            className={fieldClass}
            placeholder="2-3 Is Gunu"
          />
        </label>
        <div className="flex items-end">
          <div className="flex gap-4">
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <input type="checkbox" checked={form.featured} onChange={(e) => updateField('featured', e.target.checked)} className="h-4 w-4 accent-[#17c964]" />
              <span className="text-sm font-bold text-[#102331]">One Cikan</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <input type="checkbox" checked={form.bestSeller} onChange={(e) => updateField('bestSeller', e.target.checked)} className="h-4 w-4 accent-[#17c964]" />
              <span className="text-sm font-bold text-[#102331]">Cok Satan</span>
            </label>
          </div>
        </div>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
          <input type="checkbox" checked={form.active} onChange={(e) => updateField('active', e.target.checked)} className="h-4 w-4 accent-[#17c964]" />
          <span>
            <span className="block text-sm font-extrabold text-[#102331]">Urun aktif</span>
            <span className="mt-0.5 block text-xs text-slate-500">Aktif urunler ana sayfada ve urunler sayfasinda goruntulenir.</span>
          </span>
        </label>
      </div>

      {/* Varyantlar */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black tracking-[-0.03em] text-[#071b2b]">
              Varyantlar <span className="ml-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-bold text-slate-500">{variants.length}</span>
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">Her varyant ayri ebat, adet veya fiyat secenegi temsil eder.</p>
          </div>
          <button type="button" onClick={addVariant} className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#071b2b] px-3.5 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#0f2a3e]">
            <Plus size={16} /> Varyant Ekle
          </button>
        </div>
        <div className="space-y-2.5">
          {variants.map((v, i) => (
            <VariantEditor
              key={v.id}
              variant={v}
              index={i}
              total={variants.length}
              onChange={(updated) => updateVariant(i, updated)}
              onDelete={() => removeVariant(i)}
            />
          ))}
        </div>
      </div>

      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className={btnSecondary}>Iptal</button>
        <button type="submit" className={btnPrimary}><Save size={17} /> Kaydet</button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
function Dashboard({ products, onNavigate }) {
  const activeCount = products.filter((p) => p.active).length;
  const featuredCount = products.filter((p) => p.featured || p.bestSeller).length;
  const activeCampaigns = getActiveCampaigns();
  const allCategories = getCategories();
  const priceHistory = getPriceHistory();
  const lastChange = priceHistory.length > 0 ? priceHistory[0] : null;

  const latestProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  const cards = [
    { label: 'Toplam urun', value: products.length, icon: Package },
    { label: 'Aktif urun', value: activeCount, icon: Check },
    { label: 'Pasif urun', value: products.length - activeCount, icon: Power },
    { label: 'Aktif Kampanya', value: activeCampaigns.length, icon: Megaphone },
    { label: 'Toplam Kategori', value: allCategories.length, icon: Folder },
    { label: 'One Cikan Urun', value: featuredCount, icon: Star },
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <article key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(7,27,43,.04)]">
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#edf9f2] text-[#11984b]">
                <Icon size={21} />
              </span>
              <span className="text-3xl font-black tracking-[-0.05em] text-[#071b2b]">{value}</span>
            </div>
            <p className="mt-5 text-sm font-bold text-slate-500">{label}</p>
          </article>
        ))}
      </div>

      {/* Son fiyat degisikligi */}
      {lastChange && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <BarChart3 size={18} className="text-[#11984b]" />
            <p className="text-sm font-bold text-slate-500">
              Son fiyat degisikligi: <span className="font-extrabold text-[#071b2b]">{lastChange.productName}</span>
              {' '}
              <span className={lastChange.newPrice > lastChange.oldPrice ? 'text-red-500' : 'text-[#11984b]'}>
                {lastChange.newPrice > lastChange.oldPrice ? '+' : ''}{formatPrice(lastChange.newPrice - lastChange.oldPrice)}
              </span>
            </p>
          </div>
        </div>
      )}

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(7,27,43,.04)] sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#071b2b]">Son eklenen urunler</h2>
            <p className="mt-1 text-sm text-slate-500">En yeni urun kayitlari</p>
          </div>
          <button type="button" onClick={() => onNavigate('products')} className="text-sm font-extrabold text-[#11984b] hover:text-[#071b2b]">
            Tumunu gor
          </button>
        </div>
        <div className="mt-5 divide-y divide-slate-100">
          {latestProducts.map((product) => (
            <div key={product.id} className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="truncate font-extrabold text-[#102331]">{product.name}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {product.category} · {product.variants.length} varyant
                </p>
              </div>
              <div className="text-right">
                <p className="font-black text-[#071b2b]">{formatPrice(getStartingPrice(product))}'den</p>
                <span className={`mt-1 inline-block text-xs font-bold ${product.active ? 'text-[#11984b]' : 'text-slate-400'}`}>
                  {product.active ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            </div>
          ))}
          {latestProducts.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-400">Henuz urun eklenmedi.</p>
          )}
        </div>
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Urunler listesi
// ---------------------------------------------------------------------------
function Products({ products, onAdd, onEdit }) {
  const removeProduct = (product) => {
    if (window.confirm(`"${product.name}" urunu silinsin mi?`)) productRepository.remove(product.id);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(7,27,43,.04)]">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <h2 className="text-xl font-black tracking-[-0.03em] text-[#071b2b]">Urunler</h2>
          <p className="mt-1 text-sm text-slate-500">Fiyatlari, durumlari ve urun detaylarini yonetin.</p>
        </div>
        <button type="button" onClick={onAdd} className={btnPrimary}>
          <Plus size={17} /> Urun Ekle
        </button>
      </div>

      {/* Mobil liste */}
      <div className="divide-y divide-slate-100 md:hidden">
        {products.map((product) => (
          <article key={product.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-extrabold text-[#102331]">{product.name}</p>
                <p className="mt-1 text-xs text-slate-400">{product.category} · {product.variants.length} varyant</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${product.active ? 'bg-[#edf9f2] text-[#11984b]' : 'bg-slate-100 text-slate-500'}`}>
                {product.active ? 'Aktif' : 'Pasif'}
              </span>
            </div>
            <p className="mt-4 text-xl font-black text-[#071b2b]">{formatPrice(getStartingPrice(product))}'den</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <button type="button" onClick={() => productRepository.toggleActive(product.id)} className="flex min-h-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600"><Power size={16} /></button>
              <button type="button" onClick={() => onEdit(product.id)} className="flex min-h-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600"><Pencil size={16} /></button>
              <button type="button" onClick={() => removeProduct(product)} className="flex min-h-10 items-center justify-center rounded-xl border border-red-100 text-red-500"><Trash2 size={16} /></button>
            </div>
          </article>
        ))}
        {products.length === 0 && <p className="p-8 text-center text-sm text-slate-400">Henuz urun eklenmedi.</p>}
      </div>

      {/* Masaustu tablo */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[800px] text-left">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
              <th className="px-7 py-4">Urun</th>
              <th className="px-5 py-4">Baslangic Fiyati</th>
              <th className="px-5 py-4">Varyant</th>
              <th className="px-5 py-4">Durum</th>
              <th className="px-7 py-4 text-right">Islemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id} className="transition hover:bg-slate-50/70">
                <td className="px-7 py-5">
                  <p className="font-extrabold text-[#102331]">{product.name}</p>
                  <p className="mt-1 text-xs text-slate-400">{product.category} · {product.slug}</p>
                </td>
                <td className="px-5 py-5 font-black text-[#071b2b]">{formatPrice(getStartingPrice(product))}</td>
                <td className="px-5 py-5 text-sm font-semibold text-slate-600">{product.variants.length} adet</td>
                <td className="px-5 py-5">
                  <button
                    type="button"
                    onClick={() => productRepository.toggleActive(product.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${product.active ? 'bg-[#edf9f2] text-[#11984b]' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {product.active ? 'Aktif' : 'Pasif'}
                  </button>
                </td>
                <td className="px-7 py-5">
                  <div className="flex justify-end gap-2">
                    <a
                      href={productHref(product.slug)}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${product.name} onizle`}
                      className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-[#17c964] hover:text-[#11984b]"
                    >
                      <Eye size={16} />
                    </a>
                    <button type="button" onClick={() => onEdit(product.id)} aria-label={`${product.name} duzenle`} className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-[#17c964] hover:text-[#11984b]">
                      <Pencil size={16} />
                    </button>
                    <button type="button" onClick={() => removeProduct(product)} aria-label={`${product.name} sil`} className="grid h-9 w-9 place-items-center rounded-xl border border-red-100 text-red-400 transition hover:bg-red-50 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={5} className="p-10 text-center text-sm text-slate-400">Henuz urun eklenmedi.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Kategoriler sayfasi
// ---------------------------------------------------------------------------
function CategoriesPage() {
  const [categories, setCategories] = useState(() => getCategories());
  useEffect(() => subscribeToCategories(setCategories), []);

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', sortOrder: 0 });

  const startEdit = (cat) => {
    setEditing(cat.id);
    setForm({ name: cat.name, description: cat.description, sortOrder: cat.sortOrder });
  };

  const startAdd = () => {
    setEditing('new');
    setForm({ name: '', description: '', sortOrder: categories.length + 1 });
  };

  const handleSave = () => {
    if (!form.name.trim()) { alert('Kategori adi gereklidir.'); return; }
    if (editing === 'new') {
      categoryRepository.create({ name: form.name, slug: slugify(form.name), description: form.description, sortOrder: Number(form.sortOrder) || 0 });
    } else {
      categoryRepository.update(editing, { name: form.name, description: form.description, sortOrder: Number(form.sortOrder) || 0 });
    }
    setEditing(null);
  };

  const handleDelete = (cat) => {
    if (window.confirm(`"${cat.name}" kategorisi silinsin mi?`)) categoryRepository.remove(cat.id);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(7,27,43,.04)]">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <h2 className="text-xl font-black tracking-[-0.03em] text-[#071b2b]">Kategoriler</h2>
          <p className="mt-1 text-sm text-slate-500">Urun kategorilerini yonetin.</p>
        </div>
        <button type="button" onClick={startAdd} className={btnPrimary}><Plus size={17} /> Kategori Ekle</button>
      </div>

      {/* Form */}
      {editing && (
        <div className="border-b border-slate-100 bg-slate-50/50 p-5 sm:p-7">
          <h3 className="mb-4 text-sm font-black text-[#071b2b]">{editing === 'new' ? 'Yeni Kategori' : 'Kategori Duzenle'}</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className={labelClass}>
              Kategori adi
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={fieldClass} required />
            </label>
            <label className={labelClass}>
              Aciklama
              <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={fieldClass} />
            </label>
            <label className={labelClass}>
              Siralama
              <input type="number" min="0" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))} className={fieldClass} />
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={handleSave} className={btnPrimary}><Save size={15} /> Kaydet</button>
            <button type="button" onClick={() => setEditing(null)} className={btnSecondary}>Iptal</button>
          </div>
        </div>
      )}

      <div className="divide-y divide-slate-100">
        {categories.sort((a, b) => a.sortOrder - b.sortOrder).map((cat) => (
          <div key={cat.id} className="flex items-center justify-between gap-4 p-5 sm:px-7">
            <div className="min-w-0">
              <p className="font-extrabold text-[#102331]">{cat.name}</p>
              <p className="mt-1 text-xs text-slate-400">{cat.slug} · Sira: {cat.sortOrder}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" onClick={() => categoryRepository.toggleActive(cat.id)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${cat.active ? 'bg-[#edf9f2] text-[#11984b]' : 'bg-slate-100 text-slate-500'}`}>
                {cat.active ? 'Aktif' : 'Pasif'}
              </button>
              <button type="button" onClick={() => startEdit(cat)} className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:text-[#11984b]"><Pencil size={14} /></button>
              <button type="button" onClick={() => handleDelete(cat)} className="grid h-9 w-9 place-items-center rounded-xl border border-red-100 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="p-8 text-center text-sm text-slate-400">Henuz kategori eklenmedi.</p>}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Kampanyalar sayfasi
// ---------------------------------------------------------------------------
function CampaignsPage() {
  const products = useProducts();
  const [campaigns, setCampaigns] = useState(() => getCampaigns());
  useEffect(() => subscribeToCampaigns(setCampaigns), []);

  const [editing, setEditing] = useState(null);
  const emptyForm = { title: '', description: '', productSlug: '', campaignPrice: 0, oldPrice: 0, badgeText: '', startDate: '', endDate: '', active: true, featured: true, sortOrder: 0 };
  const [form, setForm] = useState(emptyForm);

  const startAdd = () => { setEditing('new'); setForm(emptyForm); };
  const startEdit = (camp) => { setEditing(camp.id); setForm({ ...camp }); };
  const updateForm = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = () => {
    if (!form.title.trim()) { alert('Kampanya basligi gereklidir.'); return; }
    if (editing === 'new') {
      campaignRepository.create(form);
    } else {
      campaignRepository.update(editing, form);
    }
    setEditing(null);
  };

  const handleDelete = (camp) => {
    if (window.confirm(`"${camp.title}" kampanyasi silinsin mi?`)) campaignRepository.remove(camp.id);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(7,27,43,.04)]">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <h2 className="text-xl font-black tracking-[-0.03em] text-[#071b2b]">Kampanyalar</h2>
          <p className="mt-1 text-sm text-slate-500">Kampanya olusturun, duzenleyin ve yonetin.</p>
        </div>
        <button type="button" onClick={startAdd} className={btnPrimary}><Plus size={17} /> Kampanya Ekle</button>
      </div>

      {/* Form */}
      {editing && (
        <div className="border-b border-slate-100 bg-slate-50/50 p-5 sm:p-7">
          <h3 className="mb-4 text-sm font-black text-[#071b2b]">{editing === 'new' ? 'Yeni Kampanya' : 'Kampanya Duzenle'}</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className={labelClass}>
              Baslik
              <input value={form.title} onChange={(e) => updateForm('title', e.target.value)} className={fieldClass} required />
            </label>
            <label className={labelClass}>
              Urun
              <select value={form.productSlug} onChange={(e) => updateForm('productSlug', e.target.value)} className={fieldClass}>
                <option value="">Urun secin...</option>
                {products.map((p) => <option key={p.id} value={p.slug}>{p.name}</option>)}
              </select>
            </label>
            <label className={labelClass}>
              Rozet Metni
              <input value={form.badgeText} onChange={(e) => updateForm('badgeText', e.target.value)} className={fieldClass} placeholder="Firsat" />
            </label>
            <label className={labelClass}>
              Kampanya Fiyati (TL)
              <input type="number" min="0" step="0.01" value={form.campaignPrice} onChange={(e) => updateForm('campaignPrice', e.target.value)} className={fieldClass} />
            </label>
            <label className={labelClass}>
              Eski Fiyat (TL)
              <input type="number" min="0" step="0.01" value={form.oldPrice} onChange={(e) => updateForm('oldPrice', e.target.value)} className={fieldClass} />
            </label>
            <label className={labelClass}>
              Siralama
              <input type="number" min="0" value={form.sortOrder} onChange={(e) => updateForm('sortOrder', e.target.value)} className={fieldClass} />
            </label>
            <label className={labelClass}>
              Baslangic Tarihi
              <input type="date" value={form.startDate} onChange={(e) => updateForm('startDate', e.target.value)} className={fieldClass} />
            </label>
            <label className={labelClass}>
              Bitis Tarihi
              <input type="date" value={form.endDate} onChange={(e) => updateForm('endDate', e.target.value)} className={fieldClass} />
            </label>
            <label className={`${labelClass} sm:col-span-2 lg:col-span-3`}>
              Aciklama
              <input value={form.description} onChange={(e) => updateForm('description', e.target.value)} className={fieldClass} />
            </label>
            <div className="flex gap-4 sm:col-span-2 lg:col-span-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
                <input type="checkbox" checked={form.active} onChange={(e) => updateForm('active', e.target.checked)} className="h-4 w-4 accent-[#17c964]" />
                <span className="text-sm font-bold">Aktif</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
                <input type="checkbox" checked={form.featured} onChange={(e) => updateForm('featured', e.target.checked)} className="h-4 w-4 accent-[#17c964]" />
                <span className="text-sm font-bold">Ana Sayfada Goster</span>
              </label>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={handleSave} className={btnPrimary}><Save size={15} /> Kaydet</button>
            <button type="button" onClick={() => setEditing(null)} className={btnSecondary}>Iptal</button>
          </div>
        </div>
      )}

      <div className="divide-y divide-slate-100">
        {campaigns.sort((a, b) => a.sortOrder - b.sortOrder).map((camp) => {
          const now = new Date().toISOString().slice(0, 10);
          const isExpired = camp.endDate && camp.endDate < now;
          const isUpcoming = camp.startDate && camp.startDate > now;
          return (
            <div key={camp.id} className={`flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 ${isExpired ? 'opacity-50' : ''}`}>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-extrabold text-[#102331]">{camp.title}</p>
                  {camp.badgeText && <span className="shrink-0 rounded-full bg-[#17c964]/15 px-2 py-0.5 text-xs font-bold text-[#11984b]">{camp.badgeText}</span>}
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {formatPrice(camp.campaignPrice)}
                  {camp.oldPrice > 0 && <> <span className="line-through">{formatPrice(camp.oldPrice)}</span></>}
                  {' · '}
                  {camp.startDate || '?'} — {camp.endDate || '?'}
                  {isExpired && ' · Suresi doldu'}
                  {isUpcoming && ' · Henuz baslamadi'}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button type="button" onClick={() => campaignRepository.toggleActive(camp.id)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${camp.active ? 'bg-[#edf9f2] text-[#11984b]' : 'bg-slate-100 text-slate-500'}`}>
                  {camp.active ? 'Aktif' : 'Pasif'}
                </button>
                <button type="button" onClick={() => startEdit(camp)} className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:text-[#11984b]"><Pencil size={14} /></button>
                <button type="button" onClick={() => handleDelete(camp)} className="grid h-9 w-9 place-items-center rounded-xl border border-red-100 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
              </div>
            </div>
          );
        })}
        {campaigns.length === 0 && <p className="p-8 text-center text-sm text-slate-400">Henuz kampanya eklenmedi.</p>}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Fiyat Gecmisi sayfasi
// ---------------------------------------------------------------------------
function PriceHistoryPage() {
  const [history, setHistory] = useState(() => getPriceHistory());
  useEffect(() => subscribeToPriceHistory(setHistory), []);
  const [filter, setFilter] = useState('');

  const filtered = filter
    ? history.filter((h) => h.productName.toLowerCase().includes(filter.toLowerCase()))
    : history;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(7,27,43,.04)]">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <h2 className="text-xl font-black tracking-[-0.03em] text-[#071b2b]">Fiyat Gecmisi</h2>
          <p className="mt-1 text-sm text-slate-500">Urun fiyat degisikliklerini takip edin.</p>
        </div>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Urun adina gore filtrele..."
          className="min-h-11 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#17c964] focus:ring-4 focus:ring-[#17c964]/10 sm:w-64"
        />
      </div>

      {/* Mobil liste */}
      <div className="divide-y divide-slate-100 md:hidden">
        {filtered.map((entry) => {
          const diff = entry.newPrice - entry.oldPrice;
          const isUp = diff > 0;
          return (
            <div key={entry.id} className="p-5">
              <p className="font-extrabold text-[#102331]">{entry.productName}</p>
              <p className="mt-1 text-xs text-slate-400">{entry.variantName}</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-sm text-slate-500">{formatPrice(entry.oldPrice)}</span>
                <span className="text-slate-300">→</span>
                <span className="text-sm font-extrabold text-[#071b2b]">{formatPrice(entry.newPrice)}</span>
                <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${isUp ? 'bg-red-50 text-red-500' : 'bg-[#edf9f2] text-[#11984b]'}`}>
                  {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {isUp ? '+' : ''}{formatPrice(diff)}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400">{new Date(entry.changedAt).toLocaleString('tr-TR')}</p>
            </div>
          );
        })}
      </div>

      {/* Masaustu tablo */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
              <th className="px-7 py-4">Urun / Varyant</th>
              <th className="px-5 py-4">Eski Fiyat</th>
              <th className="px-5 py-4">Yeni Fiyat</th>
              <th className="px-5 py-4">Fark</th>
              <th className="px-7 py-4">Tarih</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((entry) => {
              const diff = entry.newPrice - entry.oldPrice;
              const isUp = diff > 0;
              return (
                <tr key={entry.id} className="transition hover:bg-slate-50/70">
                  <td className="px-7 py-5">
                    <p className="font-extrabold text-[#102331]">{entry.productName}</p>
                    <p className="mt-1 text-xs text-slate-400">{entry.variantName}</p>
                  </td>
                  <td className="px-5 py-5 text-sm text-slate-500">{formatPrice(entry.oldPrice)}</td>
                  <td className="px-5 py-5 text-sm font-extrabold text-[#071b2b]">{formatPrice(entry.newPrice)}</td>
                  <td className="px-5 py-5">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${isUp ? 'bg-red-50 text-red-500' : 'bg-[#edf9f2] text-[#11984b]'}`}>
                      {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {isUp ? '+' : ''}{formatPrice(diff)}
                    </span>
                  </td>
                  <td className="px-7 py-5 text-sm text-slate-500">{new Date(entry.changedAt).toLocaleString('tr-TR')}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="p-10 text-center text-sm text-slate-400">Henuz fiyat degisikligi kaydedilmedi.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Site Icerikleri sayfasi
// ---------------------------------------------------------------------------

function SiteContentSection({ title, description, children, onSave, saving }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(7,27,43,.04)]">
      <div
        className="flex cursor-pointer items-center justify-between gap-4 p-5 sm:p-7 select-none"
        onClick={() => setOpen((v) => !v)}
        role="button"
        aria-expanded={open}
      >
        <div>
          <h3 className="text-lg font-black tracking-[-0.03em] text-[#071b2b]">{title}</h3>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        {open ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
      </div>
      {open && (
        <div className="border-t border-slate-100 p-5 sm:p-7">
          {children}
          <div className="mt-5 flex justify-end">
            <button type="button" onClick={onSave} disabled={saving} className={btnPrimary}>
              <Save size={17} /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SiteContentPage() {
  const [content, setContent] = useState(() => getSiteContent());
  useEffect(() => subscribeToSiteContent(setContent), []);
  const [saving, setSaving] = useState('');
  const [saved, setSaved] = useState('');

  const showSaved = (section) => {
    setSaved(section);
    setTimeout(() => setSaved(''), 2000);
  };

  const handleSave = (section) => {
    setSaving(section);
    saveSiteContentSection(section, content[section]);
    setTimeout(() => {
      setSaving('');
      showSaved(section);
    }, 300);
  };

  const update = (section, field, value) => {
    setContent((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const updateStep = (index, field, value) => {
    setContent((prev) => {
      const steps = [...prev.howItWorks.steps];
      steps[index] = { ...steps[index], [field]: value };
      return { ...prev, howItWorks: { ...prev.howItWorks, steps } };
    });
  };

  const addStep = () => {
    setContent((prev) => ({
      ...prev,
      howItWorks: {
        ...prev.howItWorks,
        steps: [...prev.howItWorks.steps, { title: '', description: '' }],
      },
    }));
  };

  const removeStep = (index) => {
    if (content.howItWorks.steps.length <= 1) return;
    setContent((prev) => ({
      ...prev,
      howItWorks: {
        ...prev.howItWorks,
        steps: prev.howItWorks.steps.filter((_, i) => i !== index),
      },
    }));
  };

  const savedBadge = (section) =>
    saved === section ? (
      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[#edf9f2] px-2.5 py-1 text-xs font-bold text-[#11984b]">
        <Check size={12} /> Kaydedildi
      </span>
    ) : null;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <SiteContentSection
        title={<>Hero Alani {savedBadge('hero')}</>}
        description="Ana sayfadaki karsilama bolumu metinleri."
        onSave={() => handleSave('hero')}
        saving={saving === 'hero'}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            Ust kucuk etiket
            <input
              value={content.hero.badge}
              onChange={(e) => update('hero', 'badge', e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            Ana buton yazisi
            <input
              value={content.hero.ctaButton}
              onChange={(e) => update('hero', 'ctaButton', e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className={`${labelClass} md:col-span-2`}>
            Ana baslik
            <textarea
              rows={2}
              value={content.hero.title}
              onChange={(e) => update('hero', 'title', e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className={`${labelClass} md:col-span-2`}>
            Alt aciklama
            <textarea
              rows={2}
              value={content.hero.description}
              onChange={(e) => update('hero', 'description', e.target.value)}
              className={fieldClass}
            />
          </label>
        </div>
      </SiteContentSection>

      {/* Hizmetler */}
      <SiteContentSection
        title={<>Hizmetler / Urunlerimiz Bolumu {savedBadge('services')}</>}
        description="Ana sayfadaki urun listeleme bolumu metinleri."
        onSave={() => handleSave('services')}
        saving={saving === 'services'}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            Bolum etiketi
            <input
              value={content.services.badge}
              onChange={(e) => update('services', 'badge', e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            Bolum basligi
            <input
              value={content.services.title}
              onChange={(e) => update('services', 'title', e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className={`${labelClass} md:col-span-2`}>
            Aciklama metni
            <textarea
              rows={2}
              value={content.services.description}
              onChange={(e) => update('services', 'description', e.target.value)}
              className={fieldClass}
            />
          </label>
        </div>
      </SiteContentSection>

      {/* Nasil Calisiyoruz */}
      <SiteContentSection
        title={<>Nasil Calisiyoruz {savedBadge('howItWorks')}</>}
        description="Surec adimlarini duzenleyin."
        onSave={() => handleSave('howItWorks')}
        saving={saving === 'howItWorks'}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            Bolum etiketi
            <input
              value={content.howItWorks.badge}
              onChange={(e) => update('howItWorks', 'badge', e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            Bolum basligi
            <input
              value={content.howItWorks.title}
              onChange={(e) => update('howItWorks', 'title', e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className={`${labelClass} md:col-span-2`}>
            Bolum aciklamasi
            <textarea
              rows={2}
              value={content.howItWorks.description}
              onChange={(e) => update('howItWorks', 'description', e.target.value)}
              className={fieldClass}
            />
          </label>
        </div>

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h4 className="text-sm font-black text-[#071b2b]">
              Adimlar <span className="ml-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-bold text-slate-500">{content.howItWorks.steps.length}</span>
            </h4>
            <button type="button" onClick={addStep} className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#071b2b] px-3.5 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#0f2a3e]">
              <Plus size={16} /> Adim Ekle
            </button>
          </div>
          <div className="space-y-3">
            {content.howItWorks.steps.map((step, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400">Adim #{i + 1}</span>
                  {content.howItWorks.steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(i)}
                      className="grid h-7 w-7 place-items-center rounded-lg border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className={labelClass}>
                    Adim basligi
                    <input
                      value={step.title}
                      onChange={(e) => updateStep(i, 'title', e.target.value)}
                      className={fieldClass}
                    />
                  </label>
                  <label className={labelClass}>
                    Adim aciklamasi
                    <textarea
                      rows={2}
                      value={step.description}
                      onChange={(e) => updateStep(i, 'description', e.target.value)}
                      className={fieldClass}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SiteContentSection>

      {/* Teklif Alani */}
      <SiteContentSection
        title={<>Teklif Alani {savedBadge('cta')}</>}
        description="Alt kisim WhatsApp teklif bolumu metinleri."
        onSave={() => handleSave('cta')}
        saving={saving === 'cta'}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            Ust etiket
            <input
              value={content.cta.badge}
              onChange={(e) => update('cta', 'badge', e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            Buton yazisi
            <input
              value={content.cta.ctaButton}
              onChange={(e) => update('cta', 'ctaButton', e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className={`${labelClass} md:col-span-2`}>
            Baslik
            <textarea
              rows={2}
              value={content.cta.title}
              onChange={(e) => update('cta', 'title', e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className={`${labelClass} md:col-span-2`}>
            Aciklama
            <textarea
              rows={2}
              value={content.cta.description}
              onChange={(e) => update('cta', 'description', e.target.value)}
              className={fieldClass}
            />
          </label>
        </div>
      </SiteContentSection>

      {/* Iletisim */}
      <SiteContentSection
        title={<>Iletisim {savedBadge('contact')}</>}
        description="Footer ve iletisim bolgesindeki bilgiler."
        onSave={() => handleSave('contact')}
        saving={saving === 'contact'}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            Telefon numarasi (gorunen)
            <input
              value={content.contact.phone}
              onChange={(e) => update('contact', 'phone', e.target.value)}
              className={fieldClass}
              placeholder="0543 110 9543"
            />
          </label>
          <label className={labelClass}>
            Telefon href (tel: linki)
            <input
              value={content.contact.phoneHref}
              onChange={(e) => update('contact', 'phoneHref', e.target.value)}
              className={fieldClass}
              placeholder="tel:+905431109543"
            />
          </label>
          <label className={labelClass}>
            WhatsApp numarasi (ulke kodu ile)
            <input
              value={content.contact.whatsappNumber}
              onChange={(e) => update('contact', 'whatsappNumber', e.target.value)}
              className={fieldClass}
              placeholder="905431109543"
            />
          </label>
          <label className={labelClass}>
            Uretim yeri
            <input
              value={content.contact.productionLocation}
              onChange={(e) => update('contact', 'productionLocation', e.target.value)}
              className={fieldClass}
              placeholder="Istanbul / Zeytinburnu"
            />
          </label>
          <label className={`${labelClass} md:col-span-2`}>
            Kargo bilgisi
            <textarea
              rows={2}
              value={content.contact.shippingInfo}
              onChange={(e) => update('contact', 'shippingInfo', e.target.value)}
              className={fieldClass}
            />
          </label>
        </div>
      </SiteContentSection>

      {/* Footer */}
      <SiteContentSection
        title={<>Footer {savedBadge('footer')}</>}
        description="Sayfa altindaki telif yazisi."
        onSave={() => handleSave('footer')}
        saving={saving === 'footer'}
      >
        <div className="grid gap-4">
          <label className={labelClass}>
            Telif yazisi
            <input
              value={content.footer.copyright}
              onChange={(e) => update('footer', 'copyright', e.target.value)}
              className={fieldClass}
            />
          </label>
        </div>
      </SiteContentSection>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Musteri Yorumlari sayfasi
// ---------------------------------------------------------------------------
function ReviewsAdminPage() {
  const [reviews, setReviews] = useState(() => getReviews());
  useEffect(() => subscribeToReviews(setReviews), []);

  const [editing, setEditing] = useState(null);
  const emptyForm = { name: '', company: '', text: '', rating: 5, avatar: '', active: true, sortOrder: reviews.length + 1 };
  const [form, setForm] = useState(emptyForm);

  const startAdd = () => { setEditing('new'); setForm({ ...emptyForm, sortOrder: reviews.length + 1 }); };
  const startEdit = (review) => { setEditing(review.id); setForm({ ...review }); };
  const updateForm = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = () => {
    if (!form.name.trim()) { alert('Musteri adi gereklidir.'); return; }
    if (!form.text.trim()) { alert('Yorum metni gereklidir.'); return; }
    if (editing === 'new') {
      reviewRepository.create(form);
    } else {
      reviewRepository.update(editing, form);
    }
    setEditing(null);
  };

  const handleDelete = (review) => {
    if (window.confirm(`"${review.name}" yorumu silinsin mi?`)) reviewRepository.remove(review.id);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(7,27,43,.04)]">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <h2 className="text-xl font-black tracking-[-0.03em] text-[#071b2b]">Musteri Yorumlari</h2>
          <p className="mt-1 text-sm text-slate-500">Musteri yorumlarini ekleyin, duzenleyin ve yonetin.</p>
        </div>
        <button type="button" onClick={startAdd} className={btnPrimary}><Plus size={17} /> Yorum Ekle</button>
      </div>

      {/* Form */}
      {editing && (
        <div className="border-b border-slate-100 bg-slate-50/50 p-5 sm:p-7">
          <h3 className="mb-4 text-sm font-black text-[#071b2b]">{editing === 'new' ? 'Yeni Yorum' : 'Yorum Duzenle'}</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className={labelClass}>
              Musteri adi
              <input value={form.name} onChange={(e) => updateForm('name', e.target.value)} className={fieldClass} required />
            </label>
            <label className={labelClass}>
              Firma / Sehir
              <input value={form.company} onChange={(e) => updateForm('company', e.target.value)} className={fieldClass} placeholder="Istanbul" />
            </label>
            <label className={labelClass}>
              Puan (1-5)
              <div className="mt-1.5 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => updateForm('rating', star)}
                    className={`grid h-10 w-10 place-items-center rounded-xl border transition ${
                      star <= form.rating
                        ? 'border-[#17c964] bg-[#edf9f2] text-[#17c964]'
                        : 'border-slate-200 text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <Star size={18} className={star <= form.rating ? 'fill-[#17c964]' : ''} />
                  </button>
                ))}
              </div>
            </label>
            <label className={labelClass}>
              Siralama
              <input type="number" min="0" value={form.sortOrder} onChange={(e) => updateForm('sortOrder', e.target.value)} className={fieldClass} />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              Profil gorseli (opsiyonel)
              <input value={form.avatar} onChange={(e) => updateForm('avatar', e.target.value)} className={fieldClass} placeholder="images/reviews/musteri.webp" />
            </label>
            <label className={`${labelClass} sm:col-span-2 lg:col-span-3`}>
              Yorum metni
              <textarea rows={3} value={form.text} onChange={(e) => updateForm('text', e.target.value)} className={fieldClass} required />
            </label>
            <div className="flex gap-4 sm:col-span-2 lg:col-span-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
                <input type="checkbox" checked={form.active} onChange={(e) => updateForm('active', e.target.checked)} className="h-4 w-4 accent-[#17c964]" />
                <span className="text-sm font-bold">Aktif</span>
              </label>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={handleSave} className={btnPrimary}><Save size={15} /> Kaydet</button>
            <button type="button" onClick={() => setEditing(null)} className={btnSecondary}>Iptal</button>
          </div>
        </div>
      )}

      <div className="divide-y divide-slate-100">
        {reviews.sort((a, b) => a.sortOrder - b.sortOrder).map((review) => (
          <div key={review.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate font-extrabold text-[#102331]">{review.name}</p>
                {review.company && <span className="shrink-0 text-xs text-slate-400">· {review.company}</span>}
              </div>
              <p className="mt-1 text-sm text-slate-500 line-clamp-2">{review.text}</p>
              <div className="mt-1.5 flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={13} className={i < review.rating ? 'fill-[#17c964] text-[#17c964]' : 'text-slate-200'} strokeWidth={1.5} />
                ))}
                <span className="ml-1 text-xs text-slate-400">Sira: {review.sortOrder}</span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" onClick={() => reviewRepository.toggleActive(review.id)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${review.active ? 'bg-[#edf9f2] text-[#11984b]' : 'bg-slate-100 text-slate-500'}`}>
                {review.active ? 'Aktif' : 'Pasif'}
              </button>
              <button type="button" onClick={() => startEdit(review)} className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:text-[#11984b]"><Pencil size={14} /></button>
              <button type="button" onClick={() => handleDelete(review)} className="grid h-9 w-9 place-items-center rounded-xl border border-red-100 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p className="p-8 text-center text-sm text-slate-400">Henuz yorum eklenmedi.</p>}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Instagram / Galeri sayfasi
// ---------------------------------------------------------------------------
function InstagramAdminPage() {
  const [posts, setPosts] = useState(() => getInstagramPosts());
  const [settings, setSettings] = useState(() => getInstagramSettings());
  useEffect(() => subscribeToInstagram(({ posts: p }) => { setPosts(getInstagramPosts()); setSettings(getInstagramSettings()); }), []);

  // --- Ayarlar ---
  const [settingsForm, setSettingsForm] = useState(() => getInstagramSettings());
  const [settingsSaved, setSettingsSaved] = useState(false);
  const updateSetting = (field, value) => setSettingsForm((f) => ({ ...f, [field]: value }));
  const handleSaveSettings = () => {
    saveInstagramSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  // --- Gorseller ---
  const [editing, setEditing] = useState(null);
  const emptyForm = { image: '', caption: '', link: '', active: true, sortOrder: posts.length + 1 };
  const [form, setForm] = useState(emptyForm);

  const startAdd = () => { setEditing('new'); setForm({ ...emptyForm, sortOrder: posts.length + 1 }); };
  const startEdit = (post) => { setEditing(post.id); setForm({ ...post }); };
  const updateForm = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = () => {
    if (!form.image.trim() && !form.caption.trim()) { alert('Gorsel yolu veya aciklama gereklidir.'); return; }
    if (editing === 'new') {
      instagramRepository.create(form);
    } else {
      instagramRepository.update(editing, form);
    }
    setEditing(null);
  };

  const handleDelete = (post) => {
    if (window.confirm('Bu gorsel silinsin mi?')) instagramRepository.remove(post.id);
  };

  return (
    <div className="space-y-5">
      {/* Ayarlar */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(7,27,43,.04)] sm:p-7">
        <div className="mb-4 flex items-center gap-2">
          <h3 className="text-lg font-black tracking-[-0.03em] text-[#071b2b]">Bolum Ayarlari</h3>
          {settingsSaved && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#edf9f2] px-2.5 py-1 text-xs font-bold text-[#11984b]">
              <Check size={12} /> Kaydedildi
            </span>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className={labelClass}>
            Bolum etiketi
            <input value={settingsForm.sectionBadge} onChange={(e) => updateSetting('sectionBadge', e.target.value)} className={fieldClass} />
          </label>
          <label className={labelClass}>
            Bolum basligi
            <input value={settingsForm.sectionTitle} onChange={(e) => updateSetting('sectionTitle', e.target.value)} className={fieldClass} />
          </label>
          <label className={labelClass}>
            Instagram profil URL
            <input value={settingsForm.profileUrl} onChange={(e) => updateSetting('profileUrl', e.target.value)} className={fieldClass} placeholder="https://instagram.com/yapyapmatbaa" />
          </label>
          <label className={labelClass}>
            Takip butonu yazisi
            <input value={settingsForm.followButtonText} onChange={(e) => updateSetting('followButtonText', e.target.value)} className={fieldClass} />
          </label>
        </div>
        <div className="mt-4 flex justify-end">
          <button type="button" onClick={handleSaveSettings} className={btnPrimary}><Save size={15} /> Ayarlari Kaydet</button>
        </div>
      </div>

      {/* Gorseller listesi */}
      <section className="rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(7,27,43,.04)]">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#071b2b]">Instagram / Galeri Gorselleri</h2>
            <p className="mt-1 text-sm text-slate-500">Galeri gorsellerini ekleyin, duzenleyin ve yonetin.</p>
          </div>
          <button type="button" onClick={startAdd} className={btnPrimary}><Plus size={17} /> Gorsel Ekle</button>
        </div>

        {/* Form */}
        {editing && (
          <div className="border-b border-slate-100 bg-slate-50/50 p-5 sm:p-7">
            <h3 className="mb-4 text-sm font-black text-[#071b2b]">{editing === 'new' ? 'Yeni Gorsel' : 'Gorsel Duzenle'}</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className={`${labelClass} sm:col-span-2 lg:col-span-3`}>
                Gorsel yolu
                <input value={form.image} onChange={(e) => updateForm('image', e.target.value)} className={fieldClass} placeholder="images/gallery/ornek.webp" />
                <span className="mt-1 block text-xs text-slate-400">
                  Gorsel dosyasini <code className="rounded bg-slate-100 px-1 font-mono">public/images/gallery/</code> klasorune ekleyin.
                </span>
              </label>
              <label className={labelClass}>
                Kisa aciklama
                <input value={form.caption} onChange={(e) => updateForm('caption', e.target.value)} className={fieldClass} placeholder="Kartvizit tasarimi" />
              </label>
              <label className={labelClass}>
                Instagram gonderi linki (opsiyonel)
                <input value={form.link} onChange={(e) => updateForm('link', e.target.value)} className={fieldClass} placeholder="https://instagram.com/p/..." />
              </label>
              <label className={labelClass}>
                Siralama
                <input type="number" min="0" value={form.sortOrder} onChange={(e) => updateForm('sortOrder', e.target.value)} className={fieldClass} />
              </label>
              <div className="flex gap-4 sm:col-span-2 lg:col-span-3">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
                  <input type="checkbox" checked={form.active} onChange={(e) => updateForm('active', e.target.checked)} className="h-4 w-4 accent-[#17c964]" />
                  <span className="text-sm font-bold">Aktif</span>
                </label>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={handleSave} className={btnPrimary}><Save size={15} /> Kaydet</button>
              <button type="button" onClick={() => setEditing(null)} className={btnSecondary}>Iptal</button>
            </div>
          </div>
        )}

        {/* Gorsel Grid */}
        <div className="p-5 sm:p-7">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {posts.sort((a, b) => a.sortOrder - b.sortOrder).map((post) => (
              <div key={post.id} className={`group relative overflow-hidden rounded-2xl border ${post.active ? 'border-slate-200' : 'border-dashed border-slate-200 opacity-60'}`}>
                <div className="aspect-square bg-slate-100">
                  {post.image ? (
                    <img src={post.image} alt={post.caption || 'Galeri gorseli'} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-slate-300">
                      <Image size={32} />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate text-xs font-bold text-[#102331]">{post.caption || 'Aciklama yok'}</p>
                  <p className="mt-0.5 text-xs text-slate-400">Sira: {post.sortOrder}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <button type="button" onClick={() => instagramRepository.toggleActive(post.id)} className={`rounded-full px-2 py-1 text-xs font-bold ${post.active ? 'bg-[#edf9f2] text-[#11984b]' : 'bg-slate-100 text-slate-500'}`}>
                      {post.active ? 'Aktif' : 'Pasif'}
                    </button>
                    <button type="button" onClick={() => startEdit(post)} className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:text-[#11984b]"><Pencil size={12} /></button>
                    <button type="button" onClick={() => handleDelete(post)} className="grid h-7 w-7 place-items-center rounded-lg border border-red-100 text-red-400 hover:text-red-600"><Trash2 size={12} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {posts.length === 0 && <p className="py-8 text-center text-sm text-slate-400">Henuz gorsel eklenmedi.</p>}
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Kalicilik uyarisi
// ---------------------------------------------------------------------------
function PersistenceBanner() {
  const [downloading, setDownloading] = useState(false);
  const hasChanges = hasLocalChanges();

  if (!hasChanges) return null;

  const handleDownload = () => {
    setDownloading(true);
    try { downloadProductsJs(); } finally { setTimeout(() => setDownloading(false), 1000); }
  };

  const handleReset = () => {
    if (window.confirm('Tum degisiklikler sifirlansin mi? Bu islem geri alinamaz.')) {
      productRepository.reset();
    }
  };

  return (
    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-extrabold text-amber-800">Kaydedilmemis degisiklikler var</p>
            <p className="mt-0.5 text-xs leading-5 text-amber-700">
              Bu degisiklikler yalnizca bu tarayicida gorunur. Tum cihazlara yayinlamak icin urun verilerini disa
              aktarin, <code className="rounded bg-amber-100 px-1 font-mono">src/data/products.js</code> dosyasiyla
              degistirin ve projeyi yeniden deploy edin.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={handleReset} className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50">
            <RotateCcw size={13} /> Sifirla
          </button>
          <button type="button" onClick={handleDownload} disabled={downloading} className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-xs font-extrabold text-white hover:bg-amber-600 disabled:opacity-70">
            <Download size={13} /> {downloading ? 'Indiriliyor...' : 'Disa Aktar (products.js)'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Admin paneli (giris sonrasi)
// ---------------------------------------------------------------------------
function AdminPanel({ onLogout }) {
  const products = useProducts();
  const [view, setView] = useState('dashboard');
  const [editingId, setEditingId] = useState(null);
  const editingProduct = products.find((p) => p.id === editingId) || null;

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Urunler', icon: Package },
    { id: 'categories', label: 'Kategoriler', icon: Folder },
    { id: 'campaigns', label: 'Kampanyalar', icon: Megaphone },
    { id: 'priceHistory', label: 'Fiyat Gecmisi', icon: BarChart3 },
    { id: 'siteContent', label: 'Site Icerikleri', icon: FileText },
    { id: 'reviews', label: 'Musteri Yorumlari', icon: MessageSquare },
    { id: 'instagram', label: 'Instagram / Galeri', icon: Instagram },
    { id: 'add', label: 'Urun Ekle', icon: Plus },
  ];

  const titles = {
    dashboard: ['Dashboard', 'Urunlerin genel durumunu goruntuleyIn.'],
    products: ['Urunler', 'Urun listenizi yonetin.'],
    categories: ['Kategoriler', 'Urun kategorilerini yonetin.'],
    campaigns: ['Kampanyalar', 'Kampanyalarinizi yonetin.'],
    priceHistory: ['Fiyat Gecmisi', 'Fiyat degisikliklerini takip edin.'],
    siteContent: ['Site Icerikleri', 'Ana sayfadaki metinleri duzenleyin.'],
    reviews: ['Musteri Yorumlari', 'Musteri yorumlarini yonetin.'],
    instagram: ['Instagram / Galeri', 'Galeri gorsellerini yonetin.'],
    add: ['Urun Ekle', 'Yeni urun bilgilerini kaydedin.'],
    edit: ['Urun Duzenle', 'Mevcut urun bilgilerini guncelleyin.'],
  };

  const navigate = (nextView) => {
    setView(nextView);
    if (nextView !== 'edit') setEditingId(null);
  };

  const editProduct = (id) => {
    setEditingId(id);
    setView('edit');
  };

  const saveProduct = (product) => {
    if (view === 'edit' && editingId) {
      productRepository.update(editingId, product);
    } else {
      productRepository.create(product);
    }
    navigate('products');
  };

  const [title, subtitle] = titles[view];

  return (
    <div className="min-h-screen bg-[#f4f7f5] text-[#102331] lg:grid lg:grid-cols-[250px_1fr]">
      {/* Kenar cubugu */}
      <aside className="bg-[#071b2b] p-5 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:p-6">
        <div className="flex items-center justify-between">
          <AdminLogo />
          <a href="../" aria-label="Siteye don" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white/60 hover:bg-white/10 hover:text-white lg:hidden">
            <ArrowLeft size={18} />
          </a>
        </div>
        <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:mt-10 lg:flex-col lg:overflow-visible" aria-label="Admin menusu">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => navigate(id)}
              className={`flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                view === id ? 'bg-[#17c964] text-[#061c13]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>
        <div className="mt-auto hidden space-y-2 pt-8 lg:block">
          <a href="../" className="flex min-h-11 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-400 transition hover:bg-white/5 hover:text-white">
            <ArrowLeft size={18} /> Siteyi Gor
          </a>
          <button type="button" onClick={onLogout} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-400 transition hover:bg-white/5 hover:text-white">
            <LogOut size={18} /> Cikis Yap
          </button>
        </div>
      </aside>

      {/* Ana icerik */}
      <main className="min-w-0">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:px-8 lg:px-10">
          <div>
            <p className="text-xs font-black uppercase tracking-[.16em] text-[#11984b]">Yonetim paneli</p>
            <h1 className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#071b2b] sm:text-3xl">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
          <button type="button" onClick={onLogout} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 lg:hidden" aria-label="Cikis yap">
            <LogOut size={18} />
          </button>
        </header>

        <div className="p-5 sm:p-8 lg:p-10">
          <PersistenceBanner />

          {view === 'dashboard' && <Dashboard products={products} onNavigate={navigate} />}
          {view === 'products' && <Products products={products} onAdd={() => navigate('add')} onEdit={editProduct} />}
          {view === 'categories' && <CategoriesPage />}
          {view === 'campaigns' && <CampaignsPage />}
          {view === 'priceHistory' && <PriceHistoryPage />}
          {view === 'siteContent' && <SiteContentPage />}
          {view === 'reviews' && <ReviewsAdminPage />}
          {view === 'instagram' && <InstagramAdminPage />}
          {view === 'add' && <ProductForm onCancel={() => navigate('products')} onSave={saveProduct} />}
          {view === 'edit' && editingProduct && (
            <ProductForm product={editingProduct} onCancel={() => navigate('products')} onSave={saveProduct} />
          )}
          {view === 'edit' && !editingProduct && (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-slate-500">Duzenlenecek urun bulunamadi.</p>
              <button type="button" onClick={() => navigate('products')} className="mt-4 font-extrabold text-[#11984b]">
                Urunlere don
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ana uygulama (auth wrapper)
// ---------------------------------------------------------------------------
export default function AdminApp() {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem(adminSessionKey) === 'authenticated',
  );

  const logout = () => {
    sessionStorage.removeItem(adminSessionKey);
    setAuthenticated(false);
  };

  return authenticated ? <AdminPanel onLogout={logout} /> : <Login onLogin={() => setAuthenticated(true)} />;
}
