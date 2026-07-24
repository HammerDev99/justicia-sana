# Agents and Skills Configuration — Reference

## Sub-agentes: Scope Attenuation

### Tabla de permisos completa

| Agente | Read | Grep | Write | Edit | Bash | Modelo |
|--------|:----:|:----:|:-----:|:----:|:----:|--------|
| code-reviewer | si | si | NO | NO | NO | sonnet |
| test-generator | si | si | tests/ | NO | si | haiku |
| doc-auditor | si | si | NO | NO | NO | haiku |
| security-scanner | si | si | NO | NO | limitado | haiku |
| refactor-planner | si | si | NO | NO | NO | haiku |
| dependency-checker | si | si | NO | NO | auditoria | haiku |
| performance-analyzer | si | si | NO | NO | profiling | haiku |
| api-reviewer | si | si | NO | NO | NO | haiku |
| db-auditor | si | si | NO | NO | NO | haiku |
| onboarding-guide | si | si | NO | NO | NO | haiku |
| senior-architect | si | si | si | si | si | sonnet |
| python-pro | si | si | si | si | si | haiku |
| ai-engineer | si | si | si | si | si | haiku |
| prompt-engineer | si | si | si | si | NO | haiku |

### Criterio de asignacion de modelo

- **sonnet** (razonamiento profundo): Decisiones criticas — code-reviewer, senior-architect
- **haiku** (rapido/economico): Tareas rutinarias — tests, auditorias, escaneos

### Estructura de un agente (.claude/agents/nombre.md)

```markdown
---
name: nombre-del-agente
description: Descripcion clara de rol y restricciones.
tools: Read, Grep, Glob  # herramientas permitidas
model: haiku  # o sonnet
---

You are a [rol] for this [tipo] project.

## Scope
- Lo que puede hacer

## Constraints
- Lo que NO puede hacer
- Restricciones de bash

## Output Format
[SEVERITY] FILE:LINE — Description
  Evidence: <snippet>
  Fix: <recommendation>

## Checklist
1. Verificacion 1
2. Verificacion 2
```

## Skills: Estructura

### Anatomia de un skill

```
.claude/skills/nombre-skill/
├── SKILL.md                # OBLIGATORIO — frontmatter + contenido
├── references/             # OPCIONAL — docs de referencia
├── scripts/                # OPCIONAL — scripts ejecutables
└── examples/               # OPCIONAL — codigo ejemplo
```

### Frontmatter YAML

```yaml
---
name: nombre-kebab-case
description: >
  Proposito breve.
  Use this skill when: [triggers].
  Also trigger when: "[keywords]".
  Do NOT use for [anti-triggers].
---
```

### Mecanismo de activacion

Los skills se auto-descubren por convencion de directorio:
1. Claude Code escanea `~/.claude/skills/*/SKILL.md` (global)
2. Claude Code escanea `<proyecto>/.claude/skills/*/SKILL.md` (proyecto)
3. Lee el `description` del frontmatter
4. Decide semanticamente si activar basado en la conversacion
5. Si se activa, inyecta el SKILL.md en el contexto

**NO hay registro explicito** — si el directorio existe, el skill esta disponible.

### Niveles de instalacion

| Nivel | Ruta | Alcance |
|-------|------|---------|
| Usuario (global) | `~/.claude/skills/nombre/` | Todos los proyectos |
| Proyecto | `<proyecto>/.claude/skills/nombre/` | Solo ese proyecto |

### Hooks de quality gates (.claude/settings.json)

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "if echo \"$FILE\" | grep -q '\\.py$'; then ruff check --fix \"$FILE\" 2>/dev/null && ruff format \"$FILE\" 2>/dev/null; fi; true"
      }
    ]
  }
}
```

Este hook ejecuta `ruff check --fix` + `ruff format` automaticamente en cada archivo `.py` editado por el agente.

## Multi-Claude Workflow

```
Instancia A (escritor)     Instancia B (revisor)
  │                           │
  ├── implementa feature      ├── code-reviewer audita
  ├── en worktree aislado     ├── ejecuta tests
  │                           ├── security-scanner verifica
  └── propone merge ────────→ └── reporta hallazgos
                                    │
                              Humano aprueba merge
```
