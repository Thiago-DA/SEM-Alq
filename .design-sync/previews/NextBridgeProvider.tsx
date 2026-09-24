import { NextBridgeProvider, StatusTag, MoneyAmount } from '@rentar/ui'

/**
 * `NextBridgeProvider` no renderiza nada propio — solo provee el
 * `ImageComponent`/`LinkComponent` reales de Next al árbol (acá se deja el
 * default nativo `<img>`/`<a>`, que es exactamente el comportamiento sin
 * `apps/web` de por medio). El contenido de adentro demuestra que los hijos
 * pasan sin cambios.
 */
export function Default() {
  return (
    <NextBridgeProvider>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16 }}>
        <StatusTag domain="propiedad" status="publicada" />
        <MoneyAmount amount={340000} emphasis />
      </div>
    </NextBridgeProvider>
  )
}
