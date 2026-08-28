import { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Download,
  Eye,
  EyeOff,
  LayoutDashboard,
  LogOut,
  Package,
  Pencil,
  Plus,
  Power,
  Printer,
  RotateCcw,
  Save,
  Trash2,
} from 'lucide-react';
import {
  adminSessionKey,
  adminUsername,
  isAdminConfigured,
  verifyAdminPassword,
} from './config/admin.js';
import {
  downloadProductsJs,
  formatPrice,
  getStartingPrice,
  hasLocalChanges,
  productRepository,
  slugify,
} from './data/productStore.js';
import { useProducts } from './hooks/useProducts.js';
import { productHref } from './routing/sitePaths.js';

// ---------------------------------------------------------------------------
// Stil sabitleri
// ---------------------------------------------------------------------------
const fieldClass =
  'mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#102331] outline-none transition placeholder:text-slate-400 focus:border-[#17c964] focus:ring-4 focus:ring-[#17c964]/10';

const labelClass = 'block text-sm font-bold text-[#102331]';

// ---------------------------------------------------------------------------
// Boş varyant şablonu
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

const emptyProduct = {
  name: '',
  category: '',
  description: '',
  image: '',
  active: true,
};

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
// Giriş ekranı
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
        setError('Kullanıcı adı veya şifre hatalı.');
      }
    } catch {
      setError('Giriş sırasında bir hata oluştu. Tarayıcı güvenlik politikasını kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdminConfigured) {
    return (
      <main className="hero-grid grid min-h-screen place-items-center bg-[#071b2b] px-5 py-10 text-white">
        <section className="w-full max-w-md rounded-[2rem] border border-red-400/20 bg-red-400/10 p-8 text-center">
          <AlertCircle className="mx-auto text-red-300" size={40} />
          <h1 className="mt-4 text-2xl font-black text-white">Admin Yapılandırılmamış</h1>
          <p className="mt-3 text-sm leading-6 text-red-200">
            <code className="rounded bg-red-400/20 px-1.5 py-0.5 font-mono">VITE_ADMIN_PASSWORD_HASH</code> ortam
            değişkeni ayarlanmamış. <br />
            Projenin kök dizinindeki <code className="rounded bg-red-400/20 px-1.5 py-0.5 font-mono">.env</code>{' '}
            dosyasını kontrol edin.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="hero-grid grid min-h-screen place-items-center bg-[#071b2b] px-5 py-10 text-white">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[.065] p-6 shadow-2xl backdrop-blur sm:p-9">
        <AdminLogo />
        <p className="mt-9 text-xs font-black uppercase tracking-[.18em] text-[#54e98f]">Yönetim paneli</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.045em]">Hoş geldiniz</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">Ürün ve fiyat bilgilerini yönetmek için giriş yapın.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-bold">
            Kullanıcı adı
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`${fieldClass} border-white/10 bg-white/10 text-white placeholder:text-slate-500 focus:border-[#17c964]`}
              autoComplete="username"
              required
            />
          </label>
          <label className="block text-sm font-bold">
            Şifre
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
                aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
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
            {loading ? 'Doğrulanıyor…' : <>Giriş Yap <ChevronRight size={18} /></>}
          </button>
        </form>
        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          Bu panel istemci tarafı SHA-256 doğrulaması kullanır. Gerçek güvenlik için backend gereklidir.
        </p>
      </section>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Tek varyant editörü
// ---------------------------------------------------------------------------
function VariantEditor({ variant, index, total, onChange, onDelete }) {
  const [expanded, setExpanded] = useState(index === 0);
  const update = (field, value) => onChange({ ...variant, [field]: value });

  return (
    <div className={`rounded-2xl border ${variant.active !== false ? 'border-slate-200 bg-slate-50' : 'border-dashed border-slate-200 bg-slate-50/60 opacity-70'}`}>
      {/* Başlık satırı */}
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
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              aria-label="Varyantı sil"
              className="grid h-7 w-7 place-items-center rounded-lg border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={14} />
            </button>
          )}
          {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </div>

      {/* Genişletilmiş içerik */}
      {expanded && (
        <div className="border-t border-slate-200 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={labelClass}>
              Model / İsim
              <input value={variant.model} onChange={(e) => update('model', e.target.value)} className={fieldClass} placeholder="Standart Düz Kesim" />
            </label>
            <label className={labelClass}>
              Fiyat (TL)
              <input type="number" min="0" step="0.01" value={variant.price} onChange={(e) => update('price', e.target.value)} className={fieldClass} required />
            </label>
            <label className={labelClass}>
              Ebat
              <input value={variant.size} onChange={(e) => update('size', e.target.value)} className={fieldClass} placeholder="8,3 × 5,1 cm" />
            </label>
            <label className={labelClass}>
              Adet
              <input type="number" min="1" value={variant.quantity} onChange={(e) => update('quantity', e.target.value)} className={fieldClass} />
            </label>
            <label className={labelClass}>
              Kağıt
              <input value={variant.paper} onChange={(e) => update('paper', e.target.value)} className={fieldClass} placeholder="350 gr Mat Kuşe" />
            </label>
            <label className={labelClass}>
              Baskı
              <input value={variant.printing} onChange={(e) => update('printing', e.target.value)} className={fieldClass} placeholder="Ön 4 Renk / Arka 4 Renk" />
            </label>
            <label className={labelClass}>
              Yüzey
              <input value={variant.finish} onChange={(e) => update('finish', e.target.value)} className={fieldClass} placeholder="Mat Selefon + Kabartma Lak" />
            </label>
            <label className={labelClass}>
              Kesim
              <input value={variant.cut} onChange={(e) => update('cut', e.target.value)} className={fieldClass} placeholder="Düz Kesim" />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              Varyant görseli (opsiyonel — boşsa ürün görseli kullanılır)
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
                <span className="mt-0.5 block text-xs text-slate-500">Pasif varyantlar müşteri tarafında gizlenir.</span>
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ürün formu (ekle / düzenle)
// ---------------------------------------------------------------------------
function ProductForm({ product, onCancel, onSave }) {
  const [form, setForm] = useState(() => ({
    name: product?.name || '',
    category: product?.category || '',
    description: product?.description || '',
    image: product?.image || '',
    active: product?.active !== false,
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
      description: product?.description || '',
      image: product?.image || '',
      active: product?.active !== false,
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
      {/* Ürün bilgileri */}
      <h2 className="mb-5 text-lg font-black tracking-[-0.03em] text-[#071b2b]">Ürün Bilgileri</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className={labelClass}>
          Ürün adı
          <input value={form.name} onChange={(e) => updateField('name', e.target.value)} className={fieldClass} required />
        </label>
        <label className={labelClass}>
          Kategori
          <input value={form.category} onChange={(e) => updateField('category', e.target.value)} className={fieldClass} placeholder="Kartvizit, Broşür…" required />
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          Açıklama
          <textarea rows={3} value={form.description} onChange={(e) => updateField('description', e.target.value)} className={fieldClass} required />
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          Ürün görseli yolu
          <input
            value={form.image}
            onChange={(e) => updateField('image', e.target.value)}
            className={fieldClass}
            placeholder="images/products/urun-adi.webp  veya  https://..."
          />
          <span className="mt-1 block text-xs text-slate-400">
            Görsel dosyasını <code className="rounded bg-slate-100 px-1 font-mono">public/images/products/</code> klasörüne ekleyin, yolunu buraya yazın.
            Boş bırakılırsa placeholder gösterilir.
          </span>
        </label>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
          <input type="checkbox" checked={form.active} onChange={(e) => updateField('active', e.target.checked)} className="h-4 w-4 accent-[#17c964]" />
          <span>
            <span className="block text-sm font-extrabold text-[#102331]">Ürün aktif</span>
            <span className="mt-0.5 block text-xs text-slate-500">Aktif ürünler ana sayfada ve ürünler sayfasında görüntülenir.</span>
          </span>
        </label>
      </div>

      {/* Varyantlar */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black tracking-[-0.03em] text-[#071b2b]">
              Varyantlar{' '}
              <span className="ml-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-bold text-slate-500">
                {variants.length}
              </span>
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">Her varyant ayrı ebat, adet veya fiyat seçeneği temsil eder.</p>
          </div>
          <button
            type="button"
            onClick={addVariant}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#071b2b] px-3.5 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#0f2a3e]"
          >
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

      {/* Butonlar */}
      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="min-h-11 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50">
          İptal
        </button>
        <button type="submit" className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#17c964] px-5 py-2.5 text-sm font-extrabold text-[#061c13] transition hover:bg-[#21d970]">
          <Save size={17} /> Kaydet
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
function Dashboard({ products, onNavigate }) {
  const activeCount = products.filter((p) => p.active).length;
  const latestProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);
  const cards = [
    { label: 'Toplam ürün', value: products.length, icon: Package },
    { label: 'Aktif ürün', value: activeCount, icon: Check },
    { label: 'Pasif ürün', value: products.length - activeCount, icon: Power },
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
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

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(7,27,43,.04)] sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#071b2b]">Son eklenen ürünler</h2>
            <p className="mt-1 text-sm text-slate-500">En yeni ürün kayıtları</p>
          </div>
          <button type="button" onClick={() => onNavigate('products')} className="text-sm font-extrabold text-[#11984b] hover:text-[#071b2b]">
            Tümünü gör
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
            <p className="py-8 text-center text-sm text-slate-400">Henüz ürün eklenmedi.</p>
          )}
        </div>
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Ürünler listesi
// ---------------------------------------------------------------------------
function Products({ products, onAdd, onEdit }) {
  const removeProduct = (product) => {
    if (window.confirm(`"${product.name}" ürünü silinsin mi?`)) productRepository.remove(product.id);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(7,27,43,.04)]">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <h2 className="text-xl font-black tracking-[-0.03em] text-[#071b2b]">Ürünler</h2>
          <p className="mt-1 text-sm text-slate-500">Fiyatları, durumları ve ürün detaylarını yönetin.</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#17c964] px-4 py-2.5 text-sm font-extrabold text-[#061c13]"
        >
          <Plus size={17} /> Ürün Ekle
        </button>
      </div>

      {/* Mobil liste */}
      <div className="divide-y divide-slate-100 md:hidden">
        {products.map((product) => (
          <article key={product.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-extrabold text-[#102331]">{product.name}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {product.category} · {product.variants.length} varyant
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${product.active ? 'bg-[#edf9f2] text-[#11984b]' : 'bg-slate-100 text-slate-500'}`}
              >
                {product.active ? 'Aktif' : 'Pasif'}
              </span>
            </div>
            <p className="mt-4 text-xl font-black text-[#071b2b]">{formatPrice(getStartingPrice(product))}'den</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => productRepository.toggleActive(product.id)}
                className="flex min-h-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600"
              >
                <Power size={16} />
              </button>
              <button
                type="button"
                onClick={() => onEdit(product.id)}
                className="flex min-h-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => removeProduct(product)}
                className="flex min-h-10 items-center justify-center rounded-xl border border-red-100 text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </article>
        ))}
        {products.length === 0 && <p className="p-8 text-center text-sm text-slate-400">Henüz ürün eklenmedi.</p>}
      </div>

      {/* Masaüstü tablo */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[800px] text-left">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
              <th className="px-7 py-4">Ürün</th>
              <th className="px-5 py-4">Başlangıç Fiyatı</th>
              <th className="px-5 py-4">Varyant</th>
              <th className="px-5 py-4">Durum</th>
              <th className="px-7 py-4 text-right">İşlemler</th>
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
                      aria-label={`${product.name} ürününü önizle`}
                      className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-[#17c964] hover:text-[#11984b]"
                    >
                      <Eye size={16} />
                    </a>
                    <button
                      type="button"
                      onClick={() => onEdit(product.id)}
                      aria-label={`${product.name} ürününü düzenle`}
                      className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-[#17c964] hover:text-[#11984b]"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeProduct(product)}
                      aria-label={`${product.name} ürününü sil`}
                      className="grid h-9 w-9 place-items-center rounded-xl border border-red-100 text-red-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-sm text-slate-400">
                  Henüz ürün eklenmedi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Kalıcılık uyarısı
// ---------------------------------------------------------------------------
function PersistenceBanner({ products }) {
  const [downloading, setDownloading] = useState(false);
  const hasChanges = hasLocalChanges();

  if (!hasChanges) return null;

  const handleDownload = () => {
    setDownloading(true);
    try {
      downloadProductsJs();
    } finally {
      setTimeout(() => setDownloading(false), 1000);
    }
  };

  const handleReset = () => {
    if (window.confirm('Tüm değişiklikler sıfırlansın mı? Bu işlem geri alınamaz.')) {
      productRepository.reset();
    }
  };

  return (
    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-extrabold text-amber-800">Kaydedilmemiş değişiklikler var</p>
            <p className="mt-0.5 text-xs leading-5 text-amber-700">
              Bu değişiklikler yalnızca bu tarayıcıda görünür. Tüm cihazlara yayınlamak için ürün verilerini dışa
              aktarın, <code className="rounded bg-amber-100 px-1 font-mono">src/data/products.js</code> dosyasıyla
              değiştirin ve projeyi yeniden deploy edin.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50"
          >
            <RotateCcw size={13} /> Sıfırla
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-xs font-extrabold text-white hover:bg-amber-600 disabled:opacity-70"
          >
            <Download size={13} /> {downloading ? 'İndiriliyor…' : 'Dışa Aktar (products.js)'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Admin paneli (giriş sonrası)
// ---------------------------------------------------------------------------
function AdminPanel({ onLogout }) {
  const products = useProducts();
  const [view, setView] = useState('dashboard');
  const [editingId, setEditingId] = useState(null);
  const editingProduct = products.find((p) => p.id === editingId) || null;

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Ürünler', icon: Package },
    { id: 'add', label: 'Ürün Ekle', icon: Plus },
  ];

  const titles = {
    dashboard: ['Dashboard', 'Ürünlerin genel durumunu görüntüleyin.'],
    products: ['Ürünler', 'Ürün listenizi yönetin.'],
    add: ['Ürün Ekle', 'Yeni ürün bilgilerini kaydedin.'],
    edit: ['Ürün Düzenle', 'Mevcut ürün bilgilerini güncelleyin.'],
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
      {/* Kenar çubuğu */}
      <aside className="bg-[#071b2b] p-5 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:p-6">
        <div className="flex items-center justify-between">
          <AdminLogo />
          <a
            href="../"
            aria-label="Siteye dön"
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <ArrowLeft size={18} />
          </a>
        </div>
        <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:mt-10 lg:flex-col lg:overflow-visible" aria-label="Admin menüsü">
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
          <a
            href="../"
            className="flex min-h-11 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft size={18} /> Siteyi Gör
          </a>
          <button
            type="button"
            onClick={onLogout}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut size={18} /> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Ana içerik */}
      <main className="min-w-0">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:px-8 lg:px-10">
          <div>
            <p className="text-xs font-black uppercase tracking-[.16em] text-[#11984b]">Yönetim paneli</p>
            <h1 className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#071b2b] sm:text-3xl">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 lg:hidden"
            aria-label="Çıkış yap"
          >
            <LogOut size={18} />
          </button>
        </header>

        <div className="p-5 sm:p-8 lg:p-10">
          <PersistenceBanner products={products} />

          {view === 'dashboard' && <Dashboard products={products} onNavigate={navigate} />}
          {view === 'products' && <Products products={products} onAdd={() => navigate('add')} onEdit={editProduct} />}
          {view === 'add' && <ProductForm onCancel={() => navigate('products')} onSave={saveProduct} />}
          {view === 'edit' && editingProduct && (
            <ProductForm product={editingProduct} onCancel={() => navigate('products')} onSave={saveProduct} />
          )}
          {view === 'edit' && !editingProduct && (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-slate-500">Düzenlenecek ürün bulunamadı.</p>
              <button type="button" onClick={() => navigate('products')} className="mt-4 font-extrabold text-[#11984b]">
                Ürünlere dön
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
