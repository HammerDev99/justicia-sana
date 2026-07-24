# Stack Adaptation — Adaptar CDAID a Otros Stacks

## Componentes a personalizar por stack

| Componente | Python (default) | .NET / C# | Node.js / TypeScript | Go | Kotlin/JVM |
|------------|------------------|-----------|---------------------|-----|------------|
| **Linter** | ruff | dotnet format + StyleCop | eslint | golint / golangci-lint | ktlint / detekt |
| **Types** | mypy --strict | C# nativo | typescript --strict | Go nativo | Kotlin nativo |
| **Tests** | pytest + hypothesis | xUnit + NUnit | jest + vitest | go test + testify | JUnit + Kotest |
| **Security** | bandit | dotnet security scan | npm audit + snyk | gosec | SpotBugs |
| **Format** | ruff format | dotnet format | prettier | gofmt | ktfmt |
| **Error handling** | Result[T,E] (returns) | Result<T> | neverthrow / Result | error values | Result (arrow-kt) |
| **Immutability** | @dataclass(frozen=True) | record / readonly | readonly / as const | structs | data class |
| **DI** | ServiceContainer manual | Microsoft.Extensions.DI | tsyringe / inversify | wire / dig | Koin / Dagger |

## Archivos a modificar

### 1. .claude/settings.json (Hook)

```json
// Python (default)
"command": "ruff check --fix \"$FILE\" && ruff format \"$FILE\""

// Node.js
"command": "eslint --fix \"$FILE\" && prettier --write \"$FILE\""

// .NET
"command": "dotnet format \"$FILE\""

// Go
"command": "gofmt -w \"$FILE\" && golangci-lint run \"$FILE\""
```

### 2. pyproject.toml → package.json / .csproj / go.mod

Reemplazar con el archivo de configuracion del stack.

### 3. .github/workflows/ci.yml

Adaptar los jobs: lint, typecheck, test, security, build.

### 4. CLAUDE.md

Adaptar:
- Stack section
- Comandos frecuentes
- Convenciones especificas del lenguaje

### 5. agent_docs/code_conventions.md

Adaptar:
- Naming conventions del lenguaje
- Error handling patterns
- Import conventions

### 6. agent_docs/testing.md

Adaptar:
- Comandos de test
- Markers/tags del framework
- Estructura de tests

### 7. .pre-commit-config.yaml

Adaptar hooks al stack.

## Lo que NO cambia entre stacks

Estos elementos son **agnosticos de lenguaje**:

- Metodologia CDAID (5 fases)
- Formato de SPECs
- Protocolo de auditoria SDD (8 puntos)
- Progressive Disclosure (3 niveles)
- Templates de Planning y Sprint
- Metricas de verificacion
- Scope attenuation de agentes
- Trazas de delegacion
- Notebooks como laboratorio
- Compactacion deliberada

## Ejemplo: Adaptacion minima a Node.js/TypeScript

1. `.claude/settings.json`: Hook → `eslint --fix + prettier`
2. `pyproject.toml` → `package.json` con `devDependencies`
3. `src/` estructura: mantener `core/`, `application/`, `infrastructure/`, `interfaces/`
4. `tests/` con jest/vitest
5. CLAUDE.md: comandos → `npm test`, `npm run lint`, `tsc --noEmit`
6. CI: `npm ci`, `npm run lint`, `npm test`, `npm run build`
7. Result pattern: usar `neverthrow` o equivalente
8. Immutability: `as const`, `readonly`, `Object.freeze`
