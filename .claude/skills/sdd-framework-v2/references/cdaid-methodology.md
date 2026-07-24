# CDAID Methodology — Reference Completa

## Que es CDAID

CDAID (Contract-Driven Artificial Intelligence Development) es un framework de desarrollo asistido por IA que formaliza 7 pilares:

| Pilar | Descripcion |
|-------|-------------|
| **SDD** | Cada cambio tiene un SPEC con ID unico, criterios verificables, y auditoria post-implementacion |
| **Progressive Disclosure** | Documentacion en 3 niveles: CLAUDE.md → agent_docs/ → docs/ |
| **Quality Gates** | Hooks que ejecutan linters en cada edicion del agente |
| **Sub-agentes** | 14 agentes con permisos graduados (scope attenuation) |
| **Skills** | Encapsulan conocimiento de dominio reutilizable |
| **Notebooks** | Mini-proyectos Jupyter para explorar → validar → migrar |
| **Verificacion continua** | TDD formal, PBT, auditorias SDD, metricas de deuda |

## Fundamentos Teoricos

### Taxonomia SDD (Bockeler/Fowler)

| Nivel | Descripcion | Madurez |
|-------|-------------|---------|
| Spec-first | Se escribe spec antes de implementar | Basico |
| Spec-anchored | La spec se mantiene viva post-implementacion | **CDAID opera aqui** |
| Spec-as-source | La spec ES el archivo fuente | Avanzado |

### Ciclo PDCA ISO/IEC 42001

```
Plan (Planning) → Do (Sprint) → Check (Validate) → Act (Correcciones)
```

Cada directorio del proyecto tiene un proposito especifico y exclusivo dentro del ciclo.

---

## El Ciclo CDAID: Tres Fases Operativas

### PLANNING — Que construir y como (`docs/plannings/`)

**Proposito**: Desglosar requerimientos en componentes y servicios. Tomar decisiones
arquitectonicas. Identificar riesgos antes de escribir codigo.

**Entradas**: Requerimientos del negocio, hallazgos de auditorias previas, deuda tecnica.

**Salidas**: Documento de planning con SPECs detallados listos para implementar.

**Actividades**:
1. **Descomposicion de requerimientos** — Partir features en componentes, servicios, entidades
2. **Decisiones tecnologicas** — Frameworks, bases de datos, infraestructura, patrones de integracion
3. **Analisis de riesgos** — Dependencias, performance, seguridad, backward compatibility
4. **Diseno de SPECs** — Para cada componente, escribir SPEC con:
   - Archivos a crear/modificar (con lineas)
   - Criterios de aceptacion verificables
   - Prioridad (P0/P1/P2) con justificacion
   - Esfuerzo estimado
5. **Orden de implementacion** — Secuencia de fases (A→B→C) con gates entre ellas

**Criterio de completitud**: El planning esta listo cuando cada SPEC tiene criterios
de aceptacion que un agente IA puede verificar sin ambiguedad.

**Mapeo CDAID**: Fases C (Context) + D (Design) + A (Architecture)

---

### SPRINT — Implementar con SPECs como contrato (`docs/sprints/`)

**Proposito**: Ejecutar la implementacion usando las SPECs como contrato. Cada historia/SPEC
tiene criterio de "ready" (SPEC escrita) y criterio de "done" (tests + contratos pasan).

**Entradas**: Planning con SPECs aprobados, baseline de tests/metricas.

**Salidas**: Codigo implementado, tests pasando, resumen de sprint con tracking.

**Actividades por cada SPEC**:
1. **Ready check** — Verificar que el SPEC tiene criterios de aceptacion claros
2. **Exploracion** — Agentes Explore leen codigo existente, dependencias, patrones de referencia
3. **TDD (RED)** — Escribir tests que validen CADA criterio del SPEC → deben FALLAR
4. **Implementacion (GREEN)** — Codigo minimo para pasar tests
5. **Quality gates** — `pytest -x` + `ruff check` + `mypy --strict`
6. **Revision** — Agentes revisores (code-reviewer, python-reviewer) en paralelo
7. **Done check** — Tests pasan + quality gates limpios + commit con referencia al SPEC
8. **Tracking** — Registrar en tabla de progreso (fecha, SPEC, commit, +tests)

**Criterio de "ready"**: SPEC tiene criterios de aceptacion verificables.
**Criterio de "done"**: Tests pasan + quality gate limpio + SPEC marcado `[x]`.

**Mapeo CDAID**: Fase I (Implementation)

---

### VALIDATE — Verificar que el codigo cumple la spec (`docs/validate/`)

**Proposito**: Verificar que el codigo implementado cumple las SPECs mediante tests,
property-based testing, analisis estatico, revision de patrones, y auditorias de seguridad.
Usar skills especializados como instrumentos de verificacion.

**Entradas**: Codigo implementado, SPECs como referencia, skills de auditoria.

**Salidas**: Documento de auditoria consolidado con veredicto (APROBADO/BLOQUEADO).

**Actividades**:
1. **Verificacion baseline** — `pytest -x`, `ruff check`, `mypy --strict` (deben pasar)
2. **Auditoria multi-agente** — Lanzar agentes especializados en paralelo:
   - **security-auditor**: OWASP, PII, injection, inmutabilidad
   - **code-reviewer**: Convenciones, bugs, Result pattern, edge cases
   - **python-reviewer**: PEP 8, type hints, idioms, docstrings
   - **architect**: Dependency flow, DDD, SOLID, domain completeness
   - **refactor-planner** (skill `/refactoring`): Smells Fowler, smell-technique matrix
   - **design-patterns analyst** (skill `/design-patterns`): GoF, SOLID violations, Pattern Decision Map
   - **dead-code scanner**: Dead imports, test gaps, deuda tecnica
3. **Protocolo SDD 8 puntos** — Cotejar cada SPEC contra el codigo (P1-P8)
4. **Clasificacion** — CONFORME / DIVERGENCIA JUSTIFICADA / DIVERGENCIA MENOR / DEFECTO
5. **Correcciones** — Fixes con TDD para hallazgos CRITICAL y HIGH
6. **Veredicto** — Tasa SDD ≥ 85% y 0 CRITICAL/HIGH → APROBADO

**Tecnicas de verificacion disponibles** (segun skills del proyecto):
- **Tests unitarios** (pytest): Verificacion funcional por SPEC
- **Property-based testing** (Hypothesis): Verificacion de invariantes del dominio
- **Analisis estatico** (ruff, mypy --strict, bandit): Calidad y seguridad
- **Smell analysis** (skill `/refactoring`): 22 smells de Fowler + 66 tecnicas
- **Pattern analysis** (skill `/design-patterns`): 22 GoF + SOLID + Code Smell→Pattern Map
- **Debugging sistematico** (skill `/systematic-debugging`): Si se encuentran bugs durante auditoria

**Principio**: Cada skill es un instrumento de verificacion. La auditoria combina multiples
instrumentos para obtener una imagen completa de la calidad del codigo.

**Mapeo CDAID**: Fase D (Deployment/Verification)

---

### Relacion entre las tres fases

```
PLANNING                    SPRINT                     VALIDATE
(Que + Como)                (Implementar)              (Verificar)
                                                       
Requerimientos  ───────→    SPEC como contrato ────→   Spec vs Codigo
Componentes                 TDD: RED → GREEN           8 puntos SDD
Decisiones arq.             Quality gates              Multi-agente
Riesgos/deps                Done = tests pass          Skills como instrumentos
                                                       
Artifact:                   Artifact:                  Artifact:
docs/plannings/*.md         docs/sprints/S*/           docs/validate/AUDIT_*.md
                            01_RESUMEN.md              (1 archivo consolidado)
```

**Flujo ciclico**: Validate produce hallazgos diferidos → alimentan el siguiente Planning.

---

## Las 4 Fases CDAID

El ciclo operativo del framework se compone de 4 fases con directorio y proposito definidos:

| Fase | Directorio | Proposito |
|------|-----------|-----------|
| **Plan** | `docs/plannings/` | Desglosar requerimientos en componentes y servicios. Decisiones sobre frameworks, bases de datos, infraestructura y patrones de integracion. Analisis de riesgos, dependencias, performance y seguridad. Producir SPECs con criterios de aceptacion verificables. |
| **Do** | `docs/sprints/` | Para cada historia/SPEC del sprint, generar spec y tareas derivadas. Usar las specs como criterio de "ready" y los tests/contratos como criterio de "done". Implementar con TDD, quality gates, tracking por SPEC. |
| **Check** | `docs/validate/` | Verificar que el codigo cumple la spec mediante tests, property-based testing, analisis estatico, revision de patrones, y auditorias de seguridad. Usar skills especializados (`/refactoring`, `/design-patterns`, `/systematic-debugging`) como instrumentos de verificacion. |
| **Act** | Dentro del mismo `AUDIT_*.md` | Corregir hallazgos CRITICAL y HIGH con TDD. Documentar fixes con commit y test agregado. Los hallazgos MEDIUM se difieren al siguiente Planning, cerrando el ciclo. |

## Progressive Disclosure en Detalle

### Nivel 1: CLAUDE.md (~120 lineas)

Funciona como "constitucion" del proyecto. Contiene:

- **Stack**: Tecnologias y versiones
- **Convenciones**: 7 reglas compactas
- **Estructura**: Arbol de directorios
- **Quick Start**: Comandos para empezar
- **Tabla de divulgacion**: "Necesitas X → Consulta agent_docs/Y.md"
- **Reglas criticas**: 6 reglas resumidas
- **Estado actual**: Barras de progreso + metricas
- **Compact Instructions**: Que preservar al compactar

### Nivel 2: agent_docs/ (9 archivos)

| Archivo | Rol | Tipo |
|---------|-----|------|
| workflow.md | Como trabajar con IA | CORE - Procesal |
| code_conventions.md | Como escribir codigo | CORE - Prescriptivo |
| testing.md | Como ejecutar tests | CORE - Operativo |
| verification_metrics.md | Como medir calidad | CORE - Metrico |
| architecture.md | Como esta construido | DOMINIO - Descriptivo |
| logging.md | Como hacer logging | DOMINIO - Prescriptivo |
| antipatterns.md | Que NO hacer | DOMINIO - Prohibitivo |
| troubleshooting.md | Como resolver problemas | DOMINIO - Reactivo |
| project_status.md | Estado actual | DOMINIO - Informativo |

### Nivel 3: docs/ (historico)

- `docs/plannings/` — Plannings de analisis/diseno
- `docs/sprints/` — Sprints de ejecucion con SPECs
- `docs/validate/` — Auditorias consolidadas (Check del PDCA)
- `docs/templates/` — Templates reutilizables (SPEC, Sprint, Auditoria, Gate)
- `docs/prompts/` — Prompts de orquestacion para sesiones agenticas
- `docs/notebooks/` — Mini-proyectos exploratorios
- `docs/diagrams/` — Diagramas (mermaid)

### Nivel 3 Detalle: docs/validate/

Directorio de verificacion y comprobacion (fase Check del ciclo PDCA).
Un solo archivo markdown por auditoria, consolidando todo:

```
docs/validate/
├── README.md                                         # Convenciones y historial
├── AUDIT_01_2026-04-06_GATE_F1_CORE_DOMAIN.md       # Auditoria #1 (completa)
├── AUDIT_02_YYYY-MM-DD_GATE_F2_APPLICATION.md        # (futuro)
└── AUDIT_NN_YYYY-MM-DD_{SLUG}.md                     # Patron
```

Cada archivo de auditoria contiene TODO en un solo documento:
1. Checklist de gate (funcional, seguridad, calidad, arquitectura)
2. Conformidad SDD (protocolo 8 puntos con tasa de aprobacion)
3. Reportes resumidos de cada agente auditor
4. Correcciones aplicadas (tabla con fix, commit, test)
5. Hallazgos diferidos (backlog con sprint estimado)
6. Veredicto final

**Naming**: `AUDIT_{NN}_{YYYY-MM-DD}_{SLUG}.md`
- NN: secuencial (01, 02, 03...)
- SLUG: `GATE_F{N}_{FASE}` para gates, `REAUDIT_F{N}` para re-auditorias, `QA_FINAL` para integracion

**Principio**: Un archivo = una auditoria completa = trazabilidad total sin fragmentacion.

## Principios de Desarrollo Agentico

1. **Convenciones fuertes > libertad**: La IA sigue reglas sin excepcion
2. **Scope attenuation**: Permisos minimos por agente
3. **Trust but verify**: Multi-Claude (escritor + revisor)
4. **Due diligence**: Leer docs antes de pedir al agente
5. **Compactacion deliberada**: No depender de auto-compactacion
6. **Trazabilidad**: Documentar propuestas IA vs aprobaciones humano

## Ciclo PDCA → Directorios

| Fase PDCA | Directorio | Contenido |
|-----------|-----------|-----------|
| **Plan** | `docs/plannings/` | Analisis, SPECs con criterios de aceptacion |
| **Do** | `docs/sprints/` | Ejecucion, tracking, commits, metricas |
| **Check** | `docs/validate/` | Auditorias consolidadas, gates, correcciones |
| **Act** | Dentro del mismo AUDIT_*.md | Fixes documentados con TDD |

## Auditoria Multi-Agente

El framework soporta auditorias con multiples agentes especializados ejecutados en paralelo.
El resultado se consolida en un solo archivo `AUDIT_NN_*.md`:

### Agentes recomendados por tipo de auditoria

| Agente | Enfoque | Skill complementario |
|--------|---------|---------------------|
| security-auditor | OWASP, PII, inputs, inmutabilidad | — |
| code-reviewer | Convenciones, bugs, Result pattern | — |
| python-reviewer | PEP 8, type hints, idioms | — |
| architect | Dependency flow, DDD, SOLID | — |
| refactor-planner | Smells Fowler, deuda tecnica | `/refactoring` |
| design-patterns analyst | GoF, SOLID, Pattern Decision Map | `/design-patterns` |
| dead-code scanner | Dead imports, test gaps, calidad | — |

### Escenarios de auditoria

| Escenario | Cuando | Slug |
|-----------|--------|------|
| Gate entre fases | Al completar F1, F2, etc. | `GATE_F{N}_{FASE}` |
| Re-auditoria | Cuando codigo de fase anterior cambia | `REAUDIT_F{N}` |
| QA final | Antes de release/deploy | `QA_FINAL` |
| Auditoria parcial | Solo seguridad, solo patrones | `SECURITY_SCAN`, `PATTERN_REVIEW` |

### Autoridad de aprobacion

- **Gates F1-F4**: Aprobacion automatica si tasa SDD ≥ 85% y 0 CRITICAL/HIGH
- **Gate F5 (integracion/deploy)**: Requiere revision humana explicita
- **Re-auditorias**: Aprobacion automatica si tasa SDD no disminuye

## Evidencia Empirica

### Sherlock-docs (proyecto referencia #1)
- 73+ dias de desarrollo
- 26 sprints, 30 plannings
- 1442+ tests, 26K LOC
- Calidad auditada: 9.1/10
- Auditoria SDD certificada: 39 conformes, 0 defectos
- NER F1: 85.3%
- API REST: 22 endpoints funcionales

### GexCom (proyecto referencia #2)
- Auditoria F1: 7 agentes, 22 hallazgos unicos, 11 CRIT+HIGH corregidos
- Tasa SDD: 93% (meta ≥85%)
- 107 tests post-auditoria, ruff 0, mypy 0
- Estructura validate/ consolidada (1 archivo por auditoria)
