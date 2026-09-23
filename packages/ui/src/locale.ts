import esES from 'antd/locale/es_ES'
import dayjs from 'dayjs'
import 'dayjs/locale/es'

// dayjs debe tener el locale español activo antes de que se rendericen los
// componentes de fecha de antd (DatePicker, Calendar) — si se llama después
// del primer render, el locale de esos componentes no se actualiza (ver FAQ
// de antd: "Why config dayjs.locale globally not work?").
dayjs.locale('es')

/**
 * Locale de antd en español (Argentina no tiene locale propio en antd, se
 * usa `es_ES` — los textos que expone son genéricos de idioma, no de país).
 * Importar una sola vez en `apps/web/src/app/layout.tsx` junto con
 * `ConfigProvider locale={antdLocale}`.
 */
export const antdLocale = esES
