/**
 * next-bridge.tsx — adaptadores reales de next/image y next/link para
 * @rentar/ui.
 *
 * Qué es: `packages/ui` expone un `NextBridgeProvider` genérico (ver
 * `packages/ui/src/providers/NextBridge.tsx`) que por default renderiza
 * `<img>`/`<a>` nativos — acá viven los ÚNICOS dos componentes de todo el
 * repo que traducen ese contrato a `next/image`/`next/link` de verdad.
 * Se inyectan una sola vez en `app/layout.tsx`.
 * Quién lo usa: `app/layout.tsx`.
 */
import Image from 'next/image'
import Link from 'next/link'
import type { ImageComponentProps, LinkComponentProps } from '@rentar/ui'

/**
 * Adaptador de `ImageComponentProps` → `next/image`, con optimización real.
 * Sin `fill`, `next/image` exige `width`/`height` — todo llamador de
 * `@rentar/ui` que no use `fill` los pasa (típicamente `logo.width`/
 * `logo.height` de una imagen importada estáticamente).
 */
export function AppImage({ src, alt, fill, width, height, sizes, priority, className, style }: ImageComponentProps) {
  if (fill) {
    return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} style={style} />
  }
  return (
    // NOTA: `?? 1` es una red de seguridad ante un llamador que rompa el
    // contrato (no manda width/height ni fill) — next/image tira en
    // build/runtime si le falta uno de los dos, así que un 1x1 visible es
    // preferible a que explote toda la página.
    <Image src={src} alt={alt} width={width ?? 1} height={height ?? 1} sizes={sizes} priority={priority} className={className} style={style} />
  )
}

/** Adaptador de `LinkComponentProps` → `next/link`, con navegación client-side real. */
export function AppLink({ href, children, ...rest }: LinkComponentProps) {
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  )
}
