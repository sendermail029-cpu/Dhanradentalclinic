'use client'

import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import SiteImage from '@/components/SiteImage'
import type { GalleryImageItem } from '@/app/gallery/_components'

const DEFAULT_ITEMS_PER_PAGE = 15
const CLINIC_ITEMS_PER_PAGE = 12

export default function GalleryGrid({
  items,
  variant = 'clinic',
}: {
  items: GalleryImageItem[]
  variant?: 'clinic' | 'before-after'
}) {
  const [page, setPage] = useState(1)
  const [activeClinicImage, setActiveClinicImage] = useState<GalleryImageItem | null>(null)
  const itemsPerPage = variant === 'clinic' ? CLINIC_ITEMS_PER_PAGE : DEFAULT_ITEMS_PER_PAGE
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage))

  const visibleItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage
    return items.slice(start, start + itemsPerPage)
  }, [items, page, itemsPerPage])

  return (
    <section className="w-full px-4 py-12 md:px-6 xl:px-8">
      {variant === 'clinic' ? (
        <div className="columns-1 gap-6 sm:columns-2 xl:columns-3">
          {visibleItems.map((item, index) => (
            <button
              key={`${item.title}-${page}-${index}`}
              type="button"
              onClick={() => setActiveClinicImage(item)}
              className="mb-6 block w-full break-inside-avoid overflow-hidden rounded-[1.5rem] bg-transparent text-left transition-transform duration-300 hover:-translate-y-1 focus:outline-none"
              aria-label={`Open ${item.title}`}
            >
              <SiteImage
                src={item.image}
                alt={item.title}
                width={1200}
                height={1600}
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="block h-auto w-full rounded-[1.5rem] shadow-[0_18px_40px_rgba(7,27,43,0.08)]"
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
          {visibleItems.map((item, index) => (
            <article
              key={`${item.title}-${page}-${index}`}
              className="overflow-hidden rounded-[1.6rem] border bg-white p-4"
              style={{
                borderColor: 'rgba(16, 34, 48, 0.08)',
                boxShadow: '0 18px 42px rgba(7, 27, 43, 0.06)',
              }}
            >
              <div className="rounded-[1.25rem] bg-[linear-gradient(135deg,#0D3460,#1A4A8C)] px-4 py-4 text-center text-white">
                <p className="text-lg font-semibold leading-tight">{item.title}</p>
              </div>

              <div className="mt-4 overflow-hidden rounded-[1.15rem] border border-black/5">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <SiteImage
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <div className="absolute left-3 top-3 rounded-[0.8rem] bg-black px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white">
                    Before
                  </div>
                  <div className="absolute left-3 top-[58%] rounded-[0.8rem] bg-black px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white">
                    After
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-white/95" />
                </div>
              </div>

              <p className="px-1 pb-1 pt-4 text-center text-sm leading-6" style={{ color: 'var(--muted)' }}>
                {item.subtitle}
              </p>
            </article>
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          disabled={page === 1}
          className="rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-45"
          style={{ borderColor: 'rgba(16, 34, 48, 0.12)', color: 'var(--db)' }}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => setPage(pageNumber)}
            className="h-11 min-w-11 rounded-full px-4 text-sm font-semibold transition-colors"
            style={{
              background: page === pageNumber ? 'var(--dm)' : 'transparent',
              color: page === pageNumber ? '#fff' : 'var(--db)',
              border: '1px solid rgba(16, 34, 48, 0.12)',
            }}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
          disabled={page === totalPages}
          className="rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-45"
          style={{ borderColor: 'rgba(16, 34, 48, 0.12)', color: 'var(--db)' }}
        >
          Next
        </button>
      </div>

      {variant === 'clinic' && activeClinicImage ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#041018]/88 p-4 backdrop-blur-sm md:p-8"
          onClick={() => setActiveClinicImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeClinicImage.title}
        >
          <button
            type="button"
            onClick={() => setActiveClinicImage(null)}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/18 md:right-6 md:top-6"
            aria-label="Close image"
          >
            <X size={20} />
          </button>
          <div
            className="max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[1.75rem] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
            onClick={(event) => event.stopPropagation()}
          >
            <SiteImage
              src={activeClinicImage.image}
              alt={activeClinicImage.title}
              width={1800}
              height={1200}
              sizes="92vw"
              className="block max-h-[92vh] w-full object-contain"
            />
          </div>
        </div>
      ) : null}
    </section>
  )
}
