# Code Conventions — Reference Completa

## Naming

| Elemento | Convencion | Ejemplo |
|----------|-----------|---------|
| Archivos | `snake_case.py` | `user_service.py` |
| Clases | `PascalCase` | `UserService` |
| Funciones | `snake_case` | `create_user` |
| Constantes | `UPPER_SNAKE` | `MAX_RETRIES` |
| Variables privadas | `_prefijo` | `_connection` |
| Type vars | `T`, `E`, `ResponseT` | `Result[T, E]` |

## Imports (orden forzado por ruff I)

```python
from __future__ import annotations  # 1. Future

import os                            # 2. Standard library
from pathlib import Path

from returns.result import Result    # 3. Third-party

from mi_proyecto.core import Entity  # 4. Local
```

## Error Handling

### Result Pattern (obligatorio para logica de negocio)

```python
from returns.result import Result, Success, Failure

def create_user(data: CreateDTO) -> Result[User, str]:
    if not data.email:
        return Failure("Email requerido")
    return Success(User(name=data.name, email=data.email))
```

### Exceptions (solo para errores irrecuperables de infraestructura)

```python
try:
    connection = db.connect()
except ConnectionError:
    logger.error("No se pudo conectar a BD", exc_info=True)
    raise
```

**PROHIBIDO**: `except: pass`, `except Exception: pass`, try/except anidados para logica de negocio.

## Logging

```python
from mi_proyecto.infrastructure.logging import get_logger

logger = get_logger(__name__)

logger.debug("Detalle tecnico")
logger.info("Evento de negocio")
logger.warning("Situacion inesperada pero recuperable")
logger.error("Error funcional", exc_info=True)
```

**PROHIBIDO**: `logging.getLogger()`, `print()`, `logger.exception()` fuera de `except`.

## DTOs y Value Objects

```python
@dataclass(frozen=True)
class UserDTO:
    """DTO inmutable."""
    name: str
    email: str
    role: str = "viewer"
```

**SIEMPRE `frozen=True`** — previene bugs de estado compartido.

## Type Hints (obligatorios en produccion)

```python
def find_user(user_id: int) -> User | None: ...
def process(items: list[Item]) -> Result[Summary, str]: ...
```

## Commits

Formato: `tipo(alcance): descripcion en espanol`

| Tipo | Cuando |
|------|--------|
| `feat` | Nueva funcionalidad |
| `fix` | Correccion de bug |
| `refactor` | Cambio sin alterar comportamiento |
| `docs` | Solo documentacion |
| `test` | Solo tests |
| `chore` | Mantenimiento (deps, config, CI) |

**Sin firma Claude/Anthropic** en commits.

## Seguridad

- **SQL**: Parametrizado (`?`, `%s`). Whitelists para tabla/columna dinamicos.
- **HTML**: Escapar todo output de usuario.
- **Archivos**: Validar paths. No construir desde input sin sanitizar.
- **Secrets**: En `.env` (gitignored). Nunca hardcoded.
