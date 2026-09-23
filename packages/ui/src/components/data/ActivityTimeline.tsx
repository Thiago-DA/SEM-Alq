import { Timeline } from 'antd'
import type { SemanticColorKey } from '../../tokens/semantic'
import { formatRelative } from '../../utils/formatDate'

interface ActivityEvent {
  id: string
  title: string
  description?: string
  date: string | Date
  /** Color del punto del evento. @default 'info' */
  colorKey?: SemanticColorKey
}

/** Props de {@link ActivityTimeline}. */
interface ActivityTimelineProps {
  events: ActivityEvent[]
  'data-testid'?: string
}

const DOT_COLOR: Record<SemanticColorKey, string> = {
  success: 'green',
  warning: 'orange',
  error: 'red',
  info: 'blue',
  neutral: 'gray',
  money: 'gold',
}

/**
 * Historial de eventos de un contrato, cobro o reclamo — cada ítem muestra
 * título, fecha relativa (`formatRelative`) y descripción opcional.
 */
export function ActivityTimeline({ events, ...rest }: ActivityTimelineProps) {
  return (
    <Timeline
      {...rest}
      items={events.map((event) => ({
        key: event.id,
        color: DOT_COLOR[event.colorKey ?? 'info'],
        content: (
          <>
            <p style={{ margin: 0, fontWeight: 600 }}>{event.title}</p>
            {/*
              suppressHydrationWarning: el texto relativo ("hace 2 minutos")
              se recalcula en cada render — casi siempre difiere entre lo que
              generó el server y el momento en que el cliente hidrata, así
              que un mismatch acá es esperable y no un bug real.
            */}
            <p
              suppressHydrationWarning
              style={{ margin: '0.125rem 0 0', fontSize: '0.8125rem', color: 'var(--rentar-color-text-tertiary)' }}
            >
              {formatRelative(event.date)}
            </p>
            {event.description && (
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem' }}>{event.description}</p>
            )}
          </>
        ),
      }))}
    />
  )
}
