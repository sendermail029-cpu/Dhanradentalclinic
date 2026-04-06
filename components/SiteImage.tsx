import Image, { type ImageProps } from 'next/image'

type SiteImageProps = ImageProps & {
  quality?: number
}

export default function SiteImage({
  quality = 72,
  sizes = '100vw',
  alt,
  ...props
}: SiteImageProps) {
  return (
    <Image
      alt={alt}
      quality={quality}
      sizes={sizes}
      {...props}
    />
  )
}
