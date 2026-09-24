'use client'

/**
 * NextBridge.tsx — puente inyectable para `next/image` y `next/link`.
 *
 * Qué es: `packages/ui` no debería importar `next/image`/`next/link`
 * directo — el catálogo `/design-system` y el sync con Claude Design
 * (Claude Design renderiza los componentes fuera del runtime real de
 * Next.js) necesitan que este paquete siga funcionando sin `next`
 * instalado en ese contexto. `next/image` en particular referencia
 * `process.env.NEXT_RUNTIME`/`process.platform`, inexistentes fuera de
 * Next — ya rompió un build una vez por este motivo (commit `271dcca`).
 *
 * La solución: `packages/ui` nunca importa `next`. Expone un Context con
 * el componente de imagen y de link a usar, con `<img>`/`<a>` nativos como
 * default (mismo comportamiento que hoy). `apps/web` inyecta los
 * adaptadores reales de `next/image`/`next/link` una sola vez, en su
 * `app/layout.tsx` (ver `apps/web/src/lib/next-bridge.tsx`).
 *
 * Quién lo usa: cualquier componente de `@rentar/ui` que necesite imagen
 * optimizada o navegación client-side (`Header`, `Footer`, `AppShell`,
 * `AuthLayout`, `PropertyCard`, `PhotoGallery`, `PlanCard`).
 */
import { createContext, useContext, type ComponentType, type CSSProperties, type PropsWithChildren, type ReactNode } from 'react'

/** Props mínimas de imagen que usan los componentes (un subconjunto de `next/image`). */
export interface ImageComponentProps {
  src: string
  alt: string
  /** Equivalente a `fill` de `next/image`: ocupa el contenedor posicionado (usa `object-fit` propio del `className`/`style` del llamador). El `<img>` nativo lo traduce a `width:100%; height:100%`. */
  fill?: boolean
  /**
   * Ancho/alto intrínsecos de la imagen (los que trae `StaticImageData.width`/
   * `.height` de una imagen importada). El adaptador real de `next/image`
   * (`apps/web/src/lib/next-bridge.tsx`) los exige si `fill` no es `true` —
   * el tamaño *visual* en pantalla lo sigue controlando `style`/`className`,
   * esto es solo lo que necesita Next para no romper el aspect ratio.
   */
  width?: number
  height?: number
  sizes?: string
  /** Equivalente a `priority` de `next/image` (carga sin lazy-loading). El `<img>` nativo lo traduce a `loading="eager"`. */
  priority?: boolean
  className?: string
  style?: CSSProperties
}
/** Componente de imagen: `next/image` en la app, `<img>` en las previews. */
export type ImageComponentType = ComponentType<ImageComponentProps>

/** Props mínimas de link que usan los componentes (un subconjunto de `next/link`). */
export interface LinkComponentProps {
  href: string
  className?: string
  children: ReactNode
  onClick?: () => void
  'aria-label'?: string
  'data-testid'?: string
}
/** Componente de link: `next/link` en la app, `<a>` en las previews. */
export type LinkComponentType = ComponentType<LinkComponentProps>

interface NextBridgeValue {
  ImageComponent: ImageComponentType
  LinkComponent: LinkComponentType
}

/** `<img>` nativo — mismo markup que ya usaban Header/Footer/AppShell/AuthLayout antes de este puente. */
const DefaultImage: ImageComponentType = ({ src, alt, className, style, fill, priority, width, height, sizes }) => (
  <img
    src={src}
    alt={alt}
    className={className}
    style={fill ? { ...style, width: '100%', height: '100%' } : style}
    width={width}
    height={height}
    sizes={sizes}
    loading={priority ? 'eager' : 'lazy'}
  />
)

/** `<a>` nativo — mismo markup que ya usaban Header/AppShell antes de este puente. */
const DefaultLink: LinkComponentType = ({ href, children, ...rest }) => (
  <a href={href} {...rest}>
    {children}
  </a>
)

const NextBridgeContext = createContext<NextBridgeValue>({
  ImageComponent: DefaultImage,
  LinkComponent: DefaultLink,
})

/**
 * Provee los componentes reales de `next/image`/`next/link` al árbol.
 * Sin este provider (catálogo `/design-sync`, Storybook, tests), todo
 * componente de `@rentar/ui` sigue funcionando con `<img>`/`<a>` nativos.
 */
export function NextBridgeProvider({
  children,
  ImageComponent = DefaultImage,
  LinkComponent = DefaultLink,
}: PropsWithChildren<Partial<NextBridgeValue>>) {
  return <NextBridgeContext.Provider value={{ ImageComponent, LinkComponent }}>{children}</NextBridgeContext.Provider>
}

/** Hook de acceso al puente. Devuelve los defaults nativos si no hay `NextBridgeProvider` en el árbol. */
export function useNextBridge(): NextBridgeValue {
  return useContext(NextBridgeContext)
}
