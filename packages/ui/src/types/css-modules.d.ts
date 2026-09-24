// Mismo motivo que images.d.ts: packages/ui no hereda next-env.d.ts de
// apps/web, así que necesita su propia declaración ambient para los
// `.module.css` que importan sus componentes.
declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}
