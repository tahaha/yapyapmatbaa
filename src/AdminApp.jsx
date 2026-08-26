import { useEffect, useState } from 'react';
import { ArrowLeft, Check, ChevronRight, Eye, EyeOff, LayoutDashboard, LogOut, Package, Pencil, Plus, Power, Printer, Save, Trash2 } from 'lucide-react';
import { adminSessionKey, localAdminCredentials } from './config/admin.js';
import { formatPrice, productRepository } from './data/productStore.js';
import { useProducts } from './hooks/useProducts.js';

const fieldClass = 'mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#102331] outline-none transition placeholder:text-slate-400 focus:border-[#17c964] focus:ring-4 focus:ring-[#17c964]/10';
const emptyProduct = {
  name: '', category: '', description: '', price: '', quantity: 1000, size: '', printFeatures: [], active: true,
};

function AdminLogo() {
  return <div className="flex items-center gap-2.5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#17c964] text-[#071b2b]"><Printer size={21} strokeWidth={2.4} /></span><span className="text-[17px] font-extrabold tracking-[-0.04em] text-white">yapyap<span className="text-[#54e98f]">matbaa</span></span></div>;
}

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username === localAdminCredentials.username && password === localAdminCredentials.password) {
      sessionStorage.setItem(adminSessionKey, 'authenticated');
      onLogin();
      return;
    }
    setError('Kullanıcı adı veya şifre hatalı.');
  };

  return <main className="hero-grid grid min-h-screen place-items-center bg-[#071b2b] px-5 py-10 text-white">
    <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[.065] p-6 shadow-2xl backdrop-blur sm:p-9">
      <AdminLogo />
      <p className="mt-9 text-xs font-black uppercase tracking-[.18em] text-[#54e98f]">Yönetim paneli</p>
      <h1 className="mt-2 text-3xl font-black tracking-[-0.045em]">Hoş geldiniz</h1>
      <p className="mt-3 text-sm leading-6 text-slate-300">Ürün ve fiyat bilgilerini yönetmek için giriş yapın.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block text-sm font-bold">Kullanıcı adı<input value={username} onChange={(event) => setUsername(event.target.value)} className={`${fieldClass} border-white/10 bg-white/10 text-white placeholder:text-slate-500 focus:border-[#17c964]`} autoComplete="username" required /></label>
        <label className="block text-sm font-bold">Şifre<span className="relative block"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} className={`${fieldClass} border-white/10 bg-white/10 pr-12 text-white placeholder:text-slate-500 focus:border-[#17c964]`} autoComplete="current-password" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></span></label>
        {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 px-3.5 py-3 text-sm text-red-200">{error}</p>}
        <button type="submit" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#17c964] px-5 py-3 font-extrabold text-[#061c13] transition hover:bg-[#21d970]">Giriş Yap <ChevronRight size={18} /></button>
      </form>
      <p className="mt-6 text-center text-xs leading-5 text-slate-500">Bu giriş ekranı yerel geliştirme içindir. Gerçek yayında sunucu tabanlı kimlik doğrulama kullanılmalıdır.</p>
    </section>
  </main>;
}

function ProductForm({ product, onCancel, onSave }) {
  const [form, setForm] = useState(product || emptyProduct);
  const [featuresText, setFeaturesText] = useState((product?.printFeatures || []).join('\n'));

  useEffect(() => {
    setForm(product || emptyProduct);
    setFeaturesText((product?.printFeatures || []).join('\n'));
  }, [product]);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
      printFeatures: featuresText.split('\n').map((feature) => feature.trim()).filter(Boolean),
    });
  };

  return <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(7,27,43,.05)] sm:p-7">
    <div className="grid gap-5 md:grid-cols-2">
      <label className="text-sm font-bold text-[#102331]">Ürün adı<input value={form.name} onChange={(event) => updateField('name', event.target.value)} className={fieldClass} required /></label>
      <label className="text-sm font-bold text-[#102331]">Kategori<input value={form.category} onChange={(event) => updateField('category', event.target.value)} className={fieldClass} placeholder="Kartvizit, Etiket, Magnet..." required /></label>
      <label className="text-sm font-bold text-[#102331]">Fiyat (TL)<input type="number" min="0" step="0.01" value={form.price} onChange={(event) => updateField('price', event.target.value)} className={fieldClass} required /></label>
      <label className="text-sm font-bold text-[#102331]">Adet<input type="number" min="1" value={form.quantity} onChange={(event) => updateField('quantity', event.target.value)} className={fieldClass} required /></label>
      <label className="text-sm font-bold text-[#102331] md:col-span-2">Ölçü<input value={form.size} onChange={(event) => updateField('size', event.target.value)} className={fieldClass} placeholder="8,3 x 5,1 cm" required /></label>
      <label className="text-sm font-bold text-[#102331] md:col-span-2">Açıklama<textarea rows="4" value={form.description} onChange={(event) => updateField('description', event.target.value)} className={fieldClass} required /></label>
      <label className="text-sm font-bold text-[#102331] md:col-span-2">Baskı özellikleri<textarea rows="5" value={featuresText} onChange={(event) => setFeaturesText(event.target.value)} className={fieldClass} placeholder={'Her özelliği ayrı satıra yazın\n350 gr. Mat Kuşe\nÇift yön renkli baskı'} required /><span className="mt-2 block text-xs font-medium text-slate-400">Her satır ana sayfada ayrı bir özellik olarak gösterilir.</span></label>
      <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2"><input type="checkbox" checked={form.active} onChange={(event) => updateField('active', event.target.checked)} className="h-5 w-5 accent-[#17c964]" /><span><span className="block text-sm font-extrabold text-[#102331]">Ürün aktif</span><span className="mt-0.5 block text-xs text-slate-500">Aktif ürünler ana sayfada görüntülenir.</span></span></label>
    </div>
    <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button type="button" onClick={onCancel} className="min-h-11 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50">İptal</button>
      <button type="submit" className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#17c964] px-5 py-2.5 text-sm font-extrabold text-[#061c13] transition hover:bg-[#21d970]"><Save size={17} /> Kaydet</button>
    </div>
  </form>;
}

function Dashboard({ products, onNavigate }) {
  const activeCount = products.filter((product) => product.active).length;
  const latestProducts = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
  const cards = [
    { label: 'Toplam ürün', value: products.length, icon: Package },
    { label: 'Aktif ürün', value: activeCount, icon: Check },
    { label: 'Pasif ürün', value: products.length - activeCount, icon: Power },
  ];
  return <>
    <div className="grid gap-4 sm:grid-cols-3">{cards.map(({ label, value, icon: Icon }) => <article key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(7,27,43,.04)]"><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#edf9f2] text-[#11984b]"><Icon size={21} /></span><span className="text-3xl font-black tracking-[-0.05em] text-[#071b2b]">{value}</span></div><p className="mt-5 text-sm font-bold text-slate-500">{label}</p></article>)}</div>
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(7,27,43,.04)] sm:p-7"><div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-black tracking-[-0.03em] text-[#071b2b]">Son eklenen ürünler</h2><p className="mt-1 text-sm text-slate-500">En yeni ürün kayıtları</p></div><button type="button" onClick={() => onNavigate('products')} className="text-sm font-extrabold text-[#11984b] hover:text-[#071b2b]">Tümünü gör</button></div><div className="mt-5 divide-y divide-slate-100">{latestProducts.map((product) => <div key={product.id} className="flex items-center justify-between gap-4 py-4"><div className="min-w-0"><p className="truncate font-extrabold text-[#102331]">{product.name}</p><p className="mt-1 text-xs text-slate-400">{product.category} · {product.quantity} adet</p></div><div className="text-right"><p className="font-black text-[#071b2b]">{formatPrice(product.price)}</p><span className={`mt-1 inline-block text-xs font-bold ${product.active ? 'text-[#11984b]' : 'text-slate-400'}`}>{product.active ? 'Aktif' : 'Pasif'}</span></div></div>)}{latestProducts.length === 0 && <p className="py-8 text-center text-sm text-slate-400">Henüz ürün eklenmedi.</p>}</div></section>
  </>;
}

function Products({ products, onAdd, onEdit }) {
  const removeProduct = (product) => {
    if (window.confirm(`“${product.name}” ürünü silinsin mi?`)) productRepository.remove(product.id);
  };
  return <section className="rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(7,27,43,.04)]"><div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7"><div><h2 className="text-xl font-black tracking-[-0.03em] text-[#071b2b]">Ürünler</h2><p className="mt-1 text-sm text-slate-500">Fiyatları, durumları ve ürün detaylarını yönetin.</p></div><button type="button" onClick={onAdd} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#17c964] px-4 py-2.5 text-sm font-extrabold text-[#061c13]"><Plus size={17} /> Ürün Ekle</button></div>
    <div className="divide-y divide-slate-100 md:hidden">{products.map((product) => <article key={product.id} className="p-5"><div className="flex items-start justify-between gap-4"><div><p className="font-extrabold text-[#102331]">{product.name}</p><p className="mt-1 text-xs text-slate-400">{product.category} · {product.quantity} adet</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${product.active ? 'bg-[#edf9f2] text-[#11984b]' : 'bg-slate-100 text-slate-500'}`}>{product.active ? 'Aktif' : 'Pasif'}</span></div><p className="mt-4 text-xl font-black text-[#071b2b]">{formatPrice(product.price)}</p><div className="mt-4 grid grid-cols-3 gap-2"><button type="button" onClick={() => productRepository.toggleActive(product.id)} className="flex min-h-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600"><Power size={16} /></button><button type="button" onClick={() => onEdit(product.id)} className="flex min-h-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600"><Pencil size={16} /></button><button type="button" onClick={() => removeProduct(product)} className="flex min-h-10 items-center justify-center rounded-xl border border-red-100 text-red-500"><Trash2 size={16} /></button></div></article>)}{products.length === 0 && <p className="p-8 text-center text-sm text-slate-400">Henüz ürün eklenmedi.</p>}</div>
    <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[760px] text-left"><thead><tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400"><th className="px-7 py-4">Ürün</th><th className="px-5 py-4">Fiyat</th><th className="px-5 py-4">Adet</th><th className="px-5 py-4">Durum</th><th className="px-7 py-4 text-right">İşlemler</th></tr></thead><tbody className="divide-y divide-slate-100">{products.map((product) => <tr key={product.id} className="transition hover:bg-slate-50/70"><td className="px-7 py-5"><p className="font-extrabold text-[#102331]">{product.name}</p><p className="mt-1 text-xs text-slate-400">{product.category} · {product.size}</p></td><td className="px-5 py-5 font-black text-[#071b2b]">{formatPrice(product.price)}</td><td className="px-5 py-5 text-sm font-semibold text-slate-600">{product.quantity}</td><td className="px-5 py-5"><button type="button" onClick={() => productRepository.toggleActive(product.id)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${product.active ? 'bg-[#edf9f2] text-[#11984b]' : 'bg-slate-100 text-slate-500'}`}>{product.active ? 'Aktif' : 'Pasif'}</button></td><td className="px-7 py-5"><div className="flex justify-end gap-2"><button type="button" onClick={() => onEdit(product.id)} aria-label={`${product.name} ürününü düzenle`} className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-[#17c964] hover:text-[#11984b]"><Pencil size={16} /></button><button type="button" onClick={() => removeProduct(product)} aria-label={`${product.name} ürününü sil`} className="grid h-9 w-9 place-items-center rounded-xl border border-red-100 text-red-400 transition hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button></div></td></tr>)}{products.length === 0 && <tr><td colSpan="5" className="p-10 text-center text-sm text-slate-400">Henüz ürün eklenmedi.</td></tr>}</tbody></table></div>
  </section>;
}

function AdminPanel({ onLogout }) {
  const products = useProducts();
  const [view, setView] = useState('dashboard');
  const [editingId, setEditingId] = useState(null);
  const editingProduct = products.find((product) => product.id === editingId) || null;
  const navigation = [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }, { id: 'products', label: 'Ürünler', icon: Package }, { id: 'add', label: 'Ürün Ekle', icon: Plus }];
  const titles = { dashboard: ['Dashboard', 'Ürünlerin genel durumunu görüntüleyin.'], products: ['Ürünler', 'Ürün listenizi yönetin.'], add: ['Ürün Ekle', 'Yeni ürün bilgilerini kaydedin.'], edit: ['Ürün Düzenle', 'Mevcut ürün bilgilerini güncelleyin.'] };
  const navigate = (nextView) => { setView(nextView); if (nextView !== 'edit') setEditingId(null); };
  const editProduct = (id) => { setEditingId(id); setView('edit'); };
  const saveProduct = (product) => { if (view === 'edit' && editingId) productRepository.update(editingId, product); else productRepository.create(product); navigate('products'); };
  const [title, subtitle] = titles[view];

  return <div className="min-h-screen bg-[#f4f7f5] text-[#102331] lg:grid lg:grid-cols-[250px_1fr]">
    <aside className="bg-[#071b2b] p-5 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:p-6"><div className="flex items-center justify-between"><AdminLogo /><a href="../" aria-label="Siteye dön" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"><ArrowLeft size={18} /></a></div><nav className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:mt-10 lg:flex-col lg:overflow-visible" aria-label="Admin menüsü">{navigation.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => navigate(id)} className={`flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition ${view === id ? 'bg-[#17c964] text-[#061c13]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><Icon size={18} /> {label}</button>)}</nav><div className="mt-auto hidden space-y-2 pt-8 lg:block"><a href="../" className="flex min-h-11 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-400 transition hover:bg-white/5 hover:text-white"><ArrowLeft size={18} /> Siteyi Gör</a><button type="button" onClick={onLogout} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-400 transition hover:bg-white/5 hover:text-white"><LogOut size={18} /> Çıkış Yap</button></div></aside>
    <main className="min-w-0"><header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:px-8 lg:px-10"><div><p className="text-xs font-black uppercase tracking-[.16em] text-[#11984b]">Yönetim paneli</p><h1 className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#071b2b] sm:text-3xl">{title}</h1><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div><button type="button" onClick={onLogout} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 lg:hidden" aria-label="Çıkış yap"><LogOut size={18} /></button></header><div className="p-5 sm:p-8 lg:p-10">{view === 'dashboard' && <Dashboard products={products} onNavigate={navigate} />}{view === 'products' && <Products products={products} onAdd={() => navigate('add')} onEdit={editProduct} />}{view === 'add' && <ProductForm onCancel={() => navigate('products')} onSave={saveProduct} />}{view === 'edit' && editingProduct && <ProductForm product={editingProduct} onCancel={() => navigate('products')} onSave={saveProduct} />}{view === 'edit' && !editingProduct && <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center"><p className="text-slate-500">Düzenlenecek ürün bulunamadı.</p><button type="button" onClick={() => navigate('products')} className="mt-4 font-extrabold text-[#11984b]">Ürünlere dön</button></div>}</div></main>
  </div>;
}

export default function AdminApp() {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem(adminSessionKey) === 'authenticated');
  const logout = () => { sessionStorage.removeItem(adminSessionKey); setAuthenticated(false); };
  return authenticated ? <AdminPanel onLogout={logout} /> : <Login onLogin={() => setAuthenticated(true)} />;
}
