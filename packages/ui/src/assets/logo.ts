/**
 * logo.ts — el logo de RentAR como asset importable (src, ancho y alto).
 *
 * Quién lo usa: `Header`, `Footer`, `AppShell` y `AuthLayout`.
 */
import raw from './logo-rentar.svg'

/**
 * Normaliza el import del logo entre los dos formatos que puede devolver:
 * un objeto `StaticImageData` (`{ src, width, height }`, el build de Next
 * vía su loader de imágenes) o un string `data:` crudo (el build de
 * `/design-sync` vía esbuild, loader `dataurl` — ahí `raw.src` queda
 * `undefined` y el `<img>` sale sin fuente). `width`/`height` para el caso
 * string salen del `viewBox="178 69 202 113"` del SVG.
 */
const isStaticImageData = typeof raw === 'object' && raw !== null

/** El logo listo para `<Image>`: `src`, `width` y `height`. */
export const LOGO = {
  src: isStaticImageData ? raw.src : (raw as unknown as string),
  width: isStaticImageData ? raw.width : 202,
  height: isStaticImageData ? raw.height : 113,
}
