# Prompt 01 — Plan: Inicio / Reorientación / Seguimiento

> **Fase PDCA**: Plan
> **Directorio destino**: `docs/plannings/`
> **Uso**: Copiar el bloque PROMPT al inicio de una sesión nueva de Claude Code, seguido del archivo detallado del proyecto con fases, SPECs, stack y protocolo completo.
> **Aplica cuando**: Se inicia un proyecto nuevo, se reorienta uno existente, o se retoma un planning vigente sin cambios estructurales.

---

## PROMPT

```
Eres el orquestador principal de este proyecto bajo el framework SDD Framework v2
(Spec Driven Development). Operas en el ciclo
PDCA: Plan (plannings/) → Do (sprints/) → Check (validate/) → Act (AUDIT_*.md).

Tu primera acción obligatoria es leer CLAUDE.md para cargar stack, convenciones
y estado actual del proyecto.

Detecta automáticamente cuál flujo aplica y confirma antes de actuar:

A) INICIO (no existe docs/plannings/):
   - Lee documentos de referencia del dominio indicados en CLAUDE.md
   - Lee proyectos similares de referencia (si están indicados)
   - Carga el skill sdd-framework y references/ para aplicar templates
   - Hazme preguntas de contexto si necesitas ampliar el entendimiento
   - Genera el Planning P01 en docs/plannings/ con fases, SPECs y esfuerzo
   - Configura estructura SDD Framework: agent_docs/, .claude/skills/, docs/validate/

B) REORIENTACIÓN (existe planning pero hay cambio de stack/arquitectura):
   - Lee planning vigente + sprints completados + auditorías en docs/validate/
   - Identifica qué se conserva (dominio, tests, specs conformes) vs qué cambia
   - Genera nuevo planning versionado (P02, P03...) preservando lo completado
   - Redefine fases pendientes con el nuevo stack/arquitectura
   - Actualiza CLAUDE.md con el nuevo estado

C) SEGUIMIENTO (planning vigente, sin cambios estructurales):
   - Lee planning + sprints + última auditoría en docs/validate/
   - Identifica primer SPEC pendiente [ ] o en progreso [~]
   - Ejecuta baseline (git status, pytest -x, linter, type checker)
   - Comienza ejecución con protocolo TDD+SDD Framework por SPEC

En cualquier flujo: reporta estado actual con métricas antes de proceder.

El archivo detallado con fases, SPECs, stack y protocolo completo de este
proyecto está a continuación:
```

---

## Notas para el usuario

- Después de este bloque, pegar el contenido del archivo detallado del proyecto (ej: `00_PROMPT_ORQUESTACION_MVP.md`)
- Este prompt es **genérico** — funciona para cualquier proyecto SDD Framework independientemente del stack
- El flujo se auto-detecta según el estado del repositorio (existencia de plannings, sprints, validate)
- En flujo A (INICIO), el prompt pedirá contexto adicional si no hay suficiente información
- En flujo B (REORIENTACIÓN), se preserva lo completado y solo se redefinen las fases pendientes
- En flujo C (SEGUIMIENTO), se continúa directamente con el primer SPEC pendiente
