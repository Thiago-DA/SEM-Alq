'use client'

import { InboxOutlined } from '@ant-design/icons'
import { Upload, type UploadFile } from 'antd'
import styles from './FileDropzone.module.css'

const { Dragger } = Upload

/** Props de {@link FileDropzone}. */
interface FileDropzoneProps {
  /** Tipos de archivo aceptados (atributo `accept` nativo), ej. `"image/*"` o `".pdf"`. */
  accept?: string
  multiple?: boolean
  /** Se llama con la lista de archivos elegidos cada vez que cambia. */
  onFilesChange?: (files: UploadFile[]) => void
  hint?: string
  'data-testid'?: string
}

/**
 * Zona de arrastrar-y-soltar para fotos de la propiedad o documentos del
 * contrato. Nunca sube nada de verdad (`beforeUpload` siempre devuelve
 * `false`) — en esta etapa del proyecto no hay backend ni storage; el
 * componente que la use debería acompañarla con `SimulatedFeatureNotice`
 * si el flujo alrededor todavía es simulado.
 */
export function FileDropzone({ accept, multiple = true, onFilesChange, hint, ...rest }: FileDropzoneProps) {
  return (
    <div {...rest}>
      <Dragger
        accept={accept}
        multiple={multiple}
        beforeUpload={() => false}
        onChange={(info) => onFilesChange?.(info.fileList)}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Arrastrá archivos acá o hacé clic para elegirlos</p>
      </Dragger>
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  )
}
