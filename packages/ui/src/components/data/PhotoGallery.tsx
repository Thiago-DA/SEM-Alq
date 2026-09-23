'use client'

import { useState } from 'react'
import { Image } from 'antd'
import { useNextBridge } from '../../providers/NextBridge'
import styles from './PhotoGallery.module.css'

export interface PhotoGalleryImage {
  src: string
  alt: string
}

/** Props de {@link PhotoGallery}. */
interface PhotoGalleryProps {
  images: PhotoGalleryImage[]
  'data-testid'?: string
}

/**
 * Galería de fotos de una propiedad: imagen principal grande + tira de
 * miniaturas clickeables, con lightbox al ampliar (`Image.PreviewGroup` de
 * antd, tal como lo pide `docs/MapaDePantallas.pdf`). Se usa en
 * `/propiedad/[id]` y en el paso 3 (fotos) del alta de propiedad.
 */
export function PhotoGallery({ images, ...rest }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const { ImageComponent } = useNextBridge()

  if (images.length === 0) {
    return null
  }

  return (
    <div className={styles.wrap} {...rest}>
      <Image.PreviewGroup>
        <div className={styles.mainWrap}>
          <Image src={images[activeIndex].src} alt={images[activeIndex].alt} className={styles.main} data-testid="photo-gallery-main" />
        </div>

        {/* El resto de las imágenes queda montado (oculto) para que el PreviewGroup las incluya en el lightbox, aunque la miniatura activa sea la que se ve grande arriba. */}
        <div className={styles.hiddenPreloadGroup}>
          {images.map((image, index) => (index === activeIndex ? null : <Image key={image.src} src={image.src} alt={image.alt} />))}
        </div>
      </Image.PreviewGroup>

      {images.length > 1 && (
        <div className={styles.thumbnails} role="tablist" aria-label="Miniaturas de fotos">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Ver foto ${index + 1} de ${images.length}`}
              className={`${styles.thumbnail} ${index === activeIndex ? styles.thumbnailActive : ''}`}
              onClick={() => setActiveIndex(index)}
              data-testid="photo-gallery-thumbnail"
            >
              <ImageComponent src={image.src} alt="" width={96} height={72} className={styles.thumbnailImg} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
