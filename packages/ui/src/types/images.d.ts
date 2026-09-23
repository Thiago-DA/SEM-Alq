// packages/ui es un proyecto TypeScript aparte (tsconfig.json propio), no
// hereda `next-env.d.ts` de apps/web — así que necesita su propia
// declaración ambient para poder importar imágenes como módulos ES
// (`import logo from './logo.svg'`, usado por Header/Footer).
//
// A diferencia de `next/image-types/global.d.ts` (que declara `*.svg` como
// `any` para no chocar con plugins tipo SVGR), acá se tipa como
// `StaticImageData` real: es exactamente lo que espera el prop `src` de
// `next/image`, y evita el único `any` que se hubiera colado en el paquete.
declare module '*.svg' {
  import type { StaticImageData } from 'next/image'
  const content: StaticImageData
  export default content
}
