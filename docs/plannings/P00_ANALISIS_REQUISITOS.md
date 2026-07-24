# Planning 00 — Análisis de Requisitos: Justicia Sana

**Fecha**: 2026-07-24
**Origen**: Propuesta "Plataforma Web y Aplicación Móvil del Comité de Convivencia Laboral — Piloto Seccional Magdalena" (`docs/cliente/PROPUESTA_CCL_PLATAFORMA.md`), formulada por Leonardo Fabio Gómez Colón (CCL Seccional Magdalena) en articulación con Daniel Arbeláez Álvarez (Ing. de software, Seccional Antioquia).
**Objetivo**: Delimitar el alcance de `justicia-sana` frente al sistema SIRAL existente y derivar la línea de trabajo estratégica (P01).
**Metodología**: SDD v2 (Spec-Driven Development) — Framework CDAID

---

## Contexto

La propuesta pide una **plataforma digital integral** para el Comité de Convivencia Laboral (CCL) de la Rama Judicial, piloto Seccional Magdalena, alineada con la Resolución 3461 de 2025. Consta de:

1. **Componente 1 — Módulo Interno Confidencial**: gestión de casos de acoso laboral de principio a fin (registro, trámite, actas, plazos, reportes, seguridad).
2. **Componente 2 — Portal Web Público**: pedagogía, transparencia y visibilidad institucional (información del comité, normativa, material educativo, canales de ayuda, participación ciudadana).
3. **Funcionalidades adicionales**: encuestas de clima, integración con canales de bienestar, notificaciones, acceso móvil (app).
4. **Integración JudIT**: SSO institucional + mesa de ayuda.

### Ecosistema existente

| Activo | Estado | Rol en este proyecto |
|--------|--------|---------------------|
| **SIRAL** (`SIRAL_System`) | v1.0.0-rc1 — 100% completo (283 tests, FastAPI + Streamlit + PostgreSQL 16, deploy VPS pendiente) | Cubre el Componente 1 (módulo interno). Referencia de dominio, convenciones CDAID y backend a extender |
| **rugby-bello-site** | LIVE (Astro + TS strict + Tailwind 4 + Cloudflare Pages) | Referencia de arquitectura estática JAMstack, SDD v2, quality gates frontend |
| **VPS SprintJudicial** | Operativo (EasyPanel + Traefik, Strapi previsto en cms.sprintjudicial.com) | Infraestructura para backend/CMS |
| **justicia-sana** (este repo) | Vacío | Portal público + complementos que se escapan de SIRAL |

---

## Matriz de cobertura: Propuesta vs SIRAL

### Requisitos YA cubiertos por SIRAL (no se re-implementan)

| Req. propuesta | Cobertura en SIRAL |
|----------------|--------------------|
| Registro seguro de quejas (formulario, adjuntos cifrados) | `RadicarQueja` + file_storage SHA-256 + Ley 1581 |
| Trámite y seguimiento de casos (estados, asignación) | `CambiarEstado`, `EstadoQueja`, RBAC (ADMIN_CCL) |
| Gestión documental y actas | Entidad `ActaComite` + use case acta |
| Reportes e informes de gestión (panel estadísticas) | `GenerarReporte` + gráficos Streamlit |
| Seguridad avanzada (roles, auditoría, cifrado, HTTPS) | JWT + RBAC + AuditLog middleware + CSP/HSTS |
| Notificaciones por correo (Ley 2213/2022) | `infrastructure/notifications` |
| Plazos legales con calendario hábil | `CalendarioHabil` (términos de 6 meses) |
| Multi-seccional (base) | Value object `Seccional`, rol SUPERADMIN |

### Brechas (GAP) — lo que falta del ecosistema

| GAP | Requisito de la propuesta | Destino propuesto |
|-----|---------------------------|-------------------|
| G-01 | Portal público: ¿Quiénes somos?, estructura del CCL, transparencia | **justicia-sana** (estático) |
| G-02 | Biblioteca de normativa y recursos legales (Ley 1010, Res. 2646, 652, 3461, circulares) | **justicia-sana** (estático) |
| G-03 | Material pedagógico: infografías, folletos, videos, e-learning | **justicia-sana** (estático + multimedia) |
| G-04 | Noticias y novedades jurisprudenciales, campañas | **justicia-sana** (contenido) |
| G-05 | Canales de ayuda y contacto: atención psicológica ARL, líneas, horarios | **justicia-sana** (estático) |
| G-06 | PQRS ciudadano enfocado a convivencia laboral | **justicia-sana** (island) + API |
| G-07 | Buzón anónimo de alertas tempranas de clima | **justicia-sana** (island) + API |
| G-08 | Encuestas de percepción y clima laboral anónimas | **justicia-sana** (island) + API |
| G-09 | Calendario de reuniones del CCL (mensuales + extraordinarias, Res. 3461) | **SIRAL** (extensión, planning propio) |
| G-10 | Alertas de plazos Res. 3461: procedimiento ≤ 65 días calendario, etapas 5–15 días | **SIRAL** (extensión de `CalendarioHabil`) |
| G-11 | Protocolos especiales: marcado y derivación de acoso sexual/violencia de género | **SIRAL** (extensión) |
| G-12 | Informe de remisión a autoridades externas (Inspector de Trabajo / Procuraduría) | **SIRAL** (extensión de reportes) |
| G-13 | Calendario de capacitaciones con inscripción en línea | **justicia-sana** (contenido + island) |
| G-14 | Comunicados internos / boletines del CCL | **justicia-sana** (contenido) |
| G-15 | SSO JudIT (autenticación institucional) | **Diferido** (dependencia institucional UTDI) |
| G-16 | Enlace soporte técnico JudIT | **justicia-sana** (enlace estático — bajo costo) |
| G-17 | App móvil (Android/iOS) | **PWA** (portal + SIRAL P04) — cross-platform diferido |
| G-18 | Notificaciones push | **Diferido** a fase PWA avanzada |
| G-19 | Piloto Seccional Magdalena (SIRAL fue diseñado con cliente de Antioquia) | **SIRAL** (parametrización por seccional) |
| G-20 | Estadísticas públicas anonimizadas en el portal | **justicia-sana** consume API SIRAL en build-time |

---

## Decisión de arquitectura (resumen)

**justicia-sana = portal público estático (JAMstack) + islands dinámicas puntuales**, complementando a SIRAL sin duplicarlo:

```
                    ┌─────────────────────────────────────────┐
                    │      justicia-sana (este repo)          │
  Ciudadanía  ───▶  │  Astro estático (Cloudflare Pages)      │
  Funcionarios      │  - Contenido: content collections (.md) │
                    │  - Islands: PQRS, encuestas, buzón      │
                    └───────────────┬─────────────────────────┘
                                    │ build-time fetch (stats públicas)
                                    │ runtime fetch (islands → API)
                    ┌───────────────▼─────────────────────────┐
                    │   SIRAL (VPS SprintJudicial)            │
  CCL / Comité ───▶ │   FastAPI + Streamlit + PostgreSQL 16   │
  (módulo interno)  │   + extensiones: encuestas, PQRS,       │
                    │     calendario CCL, derivaciones        │
                    └─────────────────────────────────────────┘
```

Justificación:
- **Presupuesto cercano a $0** (patrón rugby-bello: Cloudflare Pages free + VPS existente).
- **Seguridad por diseño**: el portal público no toca datos confidenciales; la separación intranet/DMZ que pide la propuesta se logra por arquitectura (sitio estático sin BD propia).
- **Un solo backend que mantener** (SIRAL), evitando un segundo sistema con su propia seguridad/auditoría.
- **Lighthouse 95+, accesibilidad WCAG AA, mobile-first**: requisitos de un portal institucional dirigido a ciudadanía.

---

## Preguntas Abiertas y Supuestos Adoptados

> ⚠️ Estos supuestos requieren validación del propietario del proyecto. Cambiarlos altera P01.

| # | Pregunta | Supuesto adoptado | Alternativas descartadas (por ahora) |
|---|----------|-------------------|--------------------------------------|
| Q1 | ¿Rol de justicia-sana frente a SIRAL? | Portal público + complementos; SIRAL sigue siendo el módulo interno y se integra | (b) solo portal estático; (c) plataforma integral que absorbe SIRAL |
| Q2 | ¿Gestión de contenido? | Markdown/content collections en el repo desde F0; capa de datos diseñada para migrar a Strapi (VPS) cuando cms esté configurado | Strapi desde el día 1 (bloquea por VPS); CMS de terceros |
| Q3 | ¿Backend para encuestas/PQRS/buzón? | Extender la API FastAPI de SIRAL (endpoints públicos con rate-limit, sin auth, anonimizados) | Microservicio propio; servicios de formularios de terceros |
| Q4 | ¿App móvil? | PWA instalable (portal + SIRAL P04_PWA_OFFLINE); Flutter/RN documentado como fase post-piloto | Desarrollo nativo dual (costo injustificado para formularios/consultas) |
| Q5 | ¿Dominio de producción? | Subdominio del VPS/Cloudflare existente (p.ej. `justiciasana.sprintjudicial.com`) hasta definición institucional | Dominio propio (requiere decisión/presupuesto del CCL) |
| Q6 | ¿SSO JudIT? | Diferido — requiere gestión con UTDI; el portal público no necesita auth y SIRAL ya tiene JWT propio | Integración LDAP especulativa sin acceso al directorio |
| Q7 | ¿Piloto Magdalena con SIRAL "de Antioquia"? | SIRAL ya modela `Seccional`; se parametriza sede/branding por seccional (planning en repo SIRAL) | Fork de SIRAL por seccional |

---

## Hallazgos Diferidos

| ID | Hallazgo | Razón de diferimiento |
|----|----------|----------------------|
| D-01 | SSO JudIT (G-15) | Dependencia institucional (UTDI); sin acceso al directorio activo |
| D-02 | Push notifications (G-18) | Requiere PWA madura + backend de suscripciones |
| D-03 | App nativa/cross-platform (G-17) | PWA cubre el piloto; costo no justificado aún |
| D-04 | Tickets automáticos JudIT desde casos | La propia propuesta lo marca como futuro/complejo |
| D-05 | Multi-idioma (i18n) | La propuesta lo señala como no imprescindible en Colombia |
| D-06 | NoSQL/buscador de texto para contenido | Content collections + búsqueda estática suficiente en piloto |

---

## Criterios de Éxito del Análisis

- [x] Propuesta del cliente archivada en `docs/cliente/` (docx original + Markdown)
- [x] Matriz de cobertura SIRAL vs propuesta completa (20 GAPs identificados)
- [x] Decisión de arquitectura documentada con justificación
- [x] Supuestos y preguntas abiertas explícitos (7)
- [ ] Supuestos Q1–Q7 validados por el propietario del proyecto
- [ ] P01 (plan estratégico) derivado de este análisis

---

**Versión**: 1.0
**Fecha**: 2026-07-24
