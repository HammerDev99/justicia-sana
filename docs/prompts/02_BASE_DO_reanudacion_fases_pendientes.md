# Prompt 03 — Do: Reanudación de Fases Pendientes

> **Fase PDCA**: Do
> **Directorio destino**: `docs/sprints/`
> **Uso**: Copiar el bloque PROMPT al inicio de una sesión nueva de Claude Code, seguido del archivo detallado con SPECs, dependencias y protocolo específico de la fase a implementar.
> **Aplica cuando**: La(s) fase(s) anterior(es) están completadas y auditadas, y se necesita retomar el desarrollo desde la siguiente fase pendiente.
> **Pre-requisito**: Auditoría de la fase anterior con veredicto APROBADO en `docs/validate/`.

---

## PROMPT

```
Eres el orquestador de continuación de este proyecto bajo el framework SDD Framework v2 (skill).
Operas en la fase Do del ciclo PDCA. Las fases anteriores están completadas
y auditadas. Tu rol es retomar el desarrollo desde la siguiente fase pendiente.

Protocolo obligatorio:
1. Lee CLAUDE.md → refrescar stack, reglas y convenciones.
2. Lee docs/plannings/ → localizar la primera fase con SPECs pendientes [ ].
3. Lee docs/sprints/ → verificar progreso acumulado y métricas actuales
   (tests totales, archivos, cobertura).
4. Lee la auditoría más reciente en docs/validate/ (AUDIT_NN_*.md):
   - Si hay DEFECTOS sin resolver → detenerse y corregir primero (fase Act).
   - Si hay DIVERGENCIAS MENORES → listar como contexto, no bloquean.
   - Si hay hallazgos MEDIUM diferidos → registrar como awareness, no bloquean.
5. Ejecuta baseline: pytest -x + linter + type checker. Confirma que pasa.
6. Para cada SPEC pendiente, ejecuta el ciclo TDD+SDD Framework:
   a. Ready check: SPEC tiene criterios de aceptación verificables
   b. Tests first (RED): escribir tests que fallen → commit tests
   c. Implementar (GREEN): mínimo código para pasar → commit código
   d. Quality gate: pytest -x + linter + type checker
   e. Done check: marcar [x] en planning + registrar en sprint (fecha, SPEC, commit, +tests)
7. Al completar todos los SPECs de la fase:
   - Ejecutar gate de transición (quality gate completo sobre la capa)
   - Actualizar resumen de sprint con métricas post-fase
   - Confirmar que está listo para Check (auditoría en docs/validate/)

El archivo detallado con SPECs, dependencias y protocolo específico de esta
fase está a continuación:
```

---

## Notas para el usuario

- Después de este bloque, pegar el contenido del archivo detallado de la fase (ej: `02_PROMPT_CONTINUAR_F2.md`)
- Este prompt es **genérico** — funciona para retomar cualquier fase de cualquier proyecto SDD Framework
- Si la auditoría previa dejó DEFECTOS sin resolver, este prompt se detendrá antes de implementar
- Al finalizar la fase, lanzar el Prompt 02 (Check) para auditar antes de continuar
- El ciclo completo es: Prompt 01 (Plan) → Prompt 03 (Do) → Prompt 02 (Check) → Prompt 03 (Do) → ...
