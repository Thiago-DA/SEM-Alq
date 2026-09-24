import { FileDropzone } from '@rentar/ui'

export const Default = () => <FileDropzone hint="JPG o PNG, hasta 5 fotos." />

export const Documents = () => <FileDropzone accept=".pdf" multiple={false} hint="PDF, hasta 10MB." />
