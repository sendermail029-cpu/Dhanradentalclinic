Use `SiteImage` from `@/components/SiteImage` for all website images.

Why:
- Uses Next.js image optimization
- Serves modern formats like WebP/AVIF when supported
- Helps reduce page load lag

Example:

```tsx
import SiteImage from '@/components/SiteImage'

<SiteImage
  src="/your-image.jpg"
  alt="Description"
  width={1200}
  height={800}
/>
```

For full-bleed hero images:

```tsx
<SiteImage
  src="/hero.jpg"
  alt="Hero"
  fill
  priority
  sizes="100vw"
  className="object-cover"
/>
```

Avoid using CSS `background-image` for important website images when performance matters, because those do not get the same Next.js optimization.

Navbar treatment thumbnails:

- Put original images in `assets/navbar/treatments/`
- Use the filenames listed in `assets/navbar/treatments/README.md`
- Run `npm run images:webp`
- Optimized files are generated in `public/navbar/treatments/`

This project also auto-runs the conversion before `npm run dev` and `npm run build`, so new navbar images are converted to WebP without manual editing.
