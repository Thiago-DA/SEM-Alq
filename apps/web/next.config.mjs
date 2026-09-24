/**
 * next.config.mjs — configuración de Next.js para apps/web.
 *
 * `transpilePackages`: @rentar/ui y @rentar/shared-types se consumen como
 * TypeScript fuente (sin build propio); Next.js los transpila igual que al
 * código de esta app. La resolución de @rentar/shared-types a su `src/` la
 * fija el alias `paths` de `tsconfig.json`.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  transpilePackages: ['@rentar/ui', '@rentar/shared-types'],
}

export default nextConfig
