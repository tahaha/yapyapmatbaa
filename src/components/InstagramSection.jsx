import { ArrowRight, ExternalLink, Camera } from 'lucide-react';
import { useInstagram } from '../hooks/useInstagram.js';

export default function InstagramSection() {
  const { posts, settings } = useInstagram();

  if (posts.length === 0) return null;

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs font-black uppercase tracking-[.18em] text-[#11984b]">
            {settings.sectionBadge}
          </p>
          <h2 className="text-3xl font-black tracking-[-0.045em] text-[#071b2b] sm:text-5xl">
            {settings.sectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {posts.map((post) => {
            const Wrapper = post.link ? 'a' : 'div';
            const wrapperProps = post.link
              ? { href: post.link, target: '_blank', rel: 'noreferrer' }
              : {};
            return (
              <Wrapper
                key={post.id}
                {...wrapperProps}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-100 sm:rounded-3xl"
              >
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.caption || 'Baskı örneği'}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-[#edf9f2] text-[#11984b]">
                    <Camera size={36} />
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-[#071b2b]/80 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:p-4">
                  {post.caption && (
                    <p className="mb-2 text-center text-xs font-bold text-white sm:text-sm">
                      {post.caption}
                    </p>
                  )}
                  {post.link && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#54e98f]">
                      <ExternalLink size={12} /> Gönderiyi aç
                    </span>
                  )}
                </div>
              </Wrapper>
            );
          })}
        </div>

        {/* Takip butonu */}
        {settings.profileUrl && (
          <div className="mt-10 text-center">
            <a
              href={settings.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex min-h-14 items-center gap-3 rounded-2xl border-2 border-[#071b2b] bg-[#071b2b] px-6 py-4 font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#0c293b]"
            >
              <Camera size={22} />
              {settings.followButtonText}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
