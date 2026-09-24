# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + React + TypeScript + Ant Design 6 (`ConfigProvider` theme tokens, see `packages/ui/src/theme.ts`), organized as an npm workspaces monorepo (`apps/web`, `packages/ui`, `packages/shared-types` — see the root `CLAUDE.md`). This is a stack migration of the original Vite + Tailwind prototype (still kept side-by-side in `../landing/`) onto Next.js/Ant Design — same scope, same content, same visual design, different implementation. Client-side filtering (no backend) is unchanged from the original.

## Users

Three profiles, per the source academic study (RentAR — Estudio Inicial, UTN FRC, Seminario Integrador 2026):

- **Locador particular**: owns 1-5 rental units, manages them personally, basic-to-intermediate digital literacy. Cannot justify the cost of professional property-management software or a real-estate agency.
- **Locatario**: long-term tenant, strong student segment (non-local population moving to Córdoba) plus young professionals. High digital literacy, comfortable with electronic payments.
- **Garante**: guarantor backing the tenant's lease, frequently living in a different city; needs to sign remotely.

## Product Purpose

RentAR centralizes the full lifecycle of a long-term residential rental agreed directly between landlord and tenant, with no real-estate agency: publish the property, search, apply, sign the contract electronically, calculate the periodic rent adjustment automatically, collect/register payments, handle claims, and close/republish the listing. Success = full traceability of the contract and payments for both parties, and a much lower cost/friction of remote contracting than the traditional agency path.

This repository is the **landing/home page prototype** for that product: a visual and interactive proposal (mock data, no real backend) built for a university capstone deliverable, not the production app.

## Positioning

Every competitor covers the process only partially (see the source study's comparison table): ARquiler only calculates the index adjustment; Argenprop/ZonaProp only publish and search; TusAlquileres only administers for real-estate agencies; Roomix only searches with AI; Airbnb solves remote contracting but only for short-term/furnished stays. None combine publish + search + sign + adjust + collect + administer for long-term residential rentals between individuals — that combination is RentAR's mechanism.

## Operating Context

Pilot market: Córdoba Capital, Argentina, with a strong seasonal student-driven demand spike (Dec-March). Mock neighborhoods used throughout: Nueva Córdoba (high-demand, $550k-610k/month for a 1-bedroom), Güemes, Centro, General Paz, Cofico, Alta Córdoba (~$445k-505k/month), 2026 reference values. Rent adjustment indices are IPC (INDEC) or ICL (BCRA), the two indices legally used for Argentine rental contracts.

## Capabilities and Constraints

- This build is a **front-end-only prototype**: the search bar and property grid filter a local mock dataset (`apps/web/src/lib/data/properties.mock.ts`) client-side; there is no Supabase connection and no real authentication, payments, or e-signature flow.
- Header "Iniciar sesión" / "Publicar propiedad" buttons and the property grid's "Buscar más propiedades" button are intentional visual placeholders with no destination yet — the full search/listing experience and auth are explicitly meant to live on separate, not-yet-built pages; the landing only previews up to 8 filtered results.
- Real product (out of scope here, per the source study): Supabase (persistence/auth), Vercel (hosting), MercadoPago (payments), Gemini (contract-analysis assistant), a to-be-defined e-signature mechanism.
- Only long-term unfurnished residential rentals are in scope; temporary/tourist rentals, furnished seasonal rentals, and corporate portfolios are explicitly out of scope.
- Browsers: current Chrome, Firefox, Safari, desktop and mobile (RNF-01/02). Must stay responsive across mobile/tablet/desktop and lightweight on mobile connections (RNF-12).

## Brand Commitments

- Name: **RentAR**. Logo: `apps/web/src/assets/logo-rentar.svg` (primary, house isotype + wordmark) used in header/footer; `apps/web/src/assets/logo-rentar-compact.svg` used as the favicon (`apps/web/src/app/icon.svg`).
- Palette (fixed, from the project's brand sheet): blue `#004D98` (primary), gold `#D7B15D` (accent), sky blue `#A0D1EF` (secondary).
- Typeface: **League Spartan** (loaded via Google Fonts) for all UI text.
- Voice: Rioplatense Spanish, clear, warm, trustworthy — not corporate/stiff. Copy already written throughout the shipped components.

## Evidence on Hand

- Full source document read and used as ground truth: `../Recursos/RentAR - Estudio Inicial (rev.1 corregido).pdf` (24 pages: market/user research, competitor comparison table, functional/non-functional requirements RG/RD/RNF, feasibility study, Scrum roadmap).
- Competitor structure reference (layout patterns only, never copied verbatim): saved Argenprop and ZonaProp homepages under `../Recursos/EjemplosCompetencia/`.
- Property photos are stock images (Unsplash) chosen to match modest/mid-range apartments, PHs, and houses — not aspirational mansions — curated by hand across two rounds of feedback.
- No real testimonials, pricing, or case studies exist or should be fabricated; this is an academic prototype.

## Product Principles

1. Directness over intermediation: every design decision should reinforce "trato directo con el dueño" (no agency) as the core differentiator.
2. Prototype honesty: never fake a working backend feature (auth, payments, signature) as if it were real; placeholders must read as placeholders, not broken features.
3. Keep it light: this is explicitly meant to be a lean landing, not the full product surface — depth belongs in a future dedicated page, not crammed into this one.
4. Respect the source study's requirements (RD-06 filters, RNF-02 responsive, RNF-10 usability for non-technical landlords, RNF-12 mobile performance) as hard constraints, not suggestions.

## Accessibility & Inclusion

RNF-10 explicitly targets a non-technical landlord persona: forms and primary actions must be understandable without technical knowledge. Contrast verified ≥4.5:1 for all body/UI text, visible keyboard focus (brand-blue outline), semantic form structure (labels, fieldset/legend), `aria-live` result counter, and `prefers-reduced-motion` respected globally and in both custom motion pieces (hero loop, scroll-reveal timeline).
