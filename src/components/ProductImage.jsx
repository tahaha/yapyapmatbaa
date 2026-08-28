import { ImageOff } from 'lucide-react';
import { useState } from 'react';
import { assetHref } from '../routing/sitePaths.js';

/**
 * Ürün görseli bileşeni.
 *
 * - image alanı boşsa → placeholder gösterir (görsel henüz eklenmedi)
 * - image alanı dolu ama görsel yüklenemezse → placeholder gösterir
 * - http(s):// ile başlıyorsa doğrudan URL kullanır
 * - aksi hâlde assetHref() ile site base path'e göre çözümler
 */
export default function ProductImage({ product, variant, compact = false }) {
  const rawImage = variant?.image || product?.image || '';
  const src = rawImage
    ? rawImage.startsWith('http://') || rawImage.startsWith('https://')
      ? rawImage
      : assetHref(rawImage)
    : null;

  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  const containerClass = compact
    ? 'group relative overflow-hidden bg-[#e8efeb] aspect-[4/3] rounded-t-[1.45rem]'
    : 'group relative overflow-hidden bg-[#e8efeb] aspect-[4/3] rounded-[2rem] lg:aspect-square';

  const label = variant?.model || product?.name || '';

  if (showPlaceholder) {
    return (
      <div className={containerClass}>
        {/* Placeholder: görsel henüz eklenmedi */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#d4e4db] to-[#c2d8cb]">
          <ImageOff size={compact ? 28 : 40} className="text-[#7aab8e] opacity-60" />
          <span className="text-xs font-bold text-[#7aab8e] opacity-70">Görsel Eklenmedi</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#071b2b]/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 p-5 text-white sm:p-7">
          <p className={`${compact ? 'text-xl' : 'text-3xl sm:text-4xl'} font-black tracking-[-0.04em]`}>
            {label}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <img
        src={src}
        alt={`${product?.name ?? ''} ${label} görseli`}
        className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.03]"
        onError={() => setFailed(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#071b2b]/80 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 p-5 text-white sm:p-7">
        <p className={`${compact ? 'text-xl' : 'text-3xl sm:text-4xl'} font-black tracking-[-0.04em]`}>
          {label}
        </p>
      </div>
    </div>
  );
}
