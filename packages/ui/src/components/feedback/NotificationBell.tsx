'use client'

/**
 * NotificationBell.tsx — campanita con la lista de notificaciones.
 *
 * Quién lo usa: `AppShell` y el catálogo.
 */
import { useState } from 'react'
import { BellOutlined } from '@ant-design/icons'
import { Badge, Dropdown } from 'antd'
import { formatRelative } from '../../utils/formatDate'
import styles from './NotificationBell.module.css'

/** Una notificación de la lista; sin `read` (o en `false`) cuenta como no leída. */
export interface NotificationItem {
  id: string
  title: string
  date: string | Date
  read?: boolean
}

/** Props de {@link NotificationBell}. */
interface NotificationBellProps {
  notifications: NotificationItem[]
  onSelect?: (id: string) => void
  'data-testid'?: string
}

/**
 * Campanita de notificaciones del `AppShell`: badge con la cantidad de no
 * leídas, panel desplegable con la lista (o un estado vacío). Los datos
 * llegan por props — no arma ni pide nada por su cuenta.
 */
export function NotificationBell({ notifications, onSelect, ...rest }: NotificationBellProps) {
  const [open, setOpen] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      trigger={['click']}
      popupRender={() => (
        <div className={styles.panel}>
          {notifications.length === 0 ? (
            <p className={styles.empty}>No tenés notificaciones.</p>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                className={`${styles.item} ${!n.read ? styles.itemUnread : ''}`}
                onClick={() => {
                  onSelect?.(n.id)
                  setOpen(false)
                }}
              >
                <p className={styles.itemTitle}>{n.title}</p>
                {/* suppressHydrationWarning: ver el comentario en ActivityTimeline sobre formatRelative. */}
                <p className={styles.itemDate} suppressHydrationWarning>
                  {formatRelative(n.date)}
                </p>
              </button>
            ))
          )}
        </div>
      )}
    >
      <button
        type="button"
        className={styles.trigger}
        aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} sin leer)` : ''}`}
        {...rest}
      >
        <Badge count={unreadCount} size="small">
          <BellOutlined />
        </Badge>
      </button>
    </Dropdown>
  )
}
