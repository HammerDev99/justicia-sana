# Java → Python Adaptation Guide

Equivalences, idioms, and native Python tools for refactoring.

## OOP Concept Equivalences

| Java | Python | Notes |
|------|--------|-------|
| `interface` | `typing.Protocol` or `abc.ABC` | Protocol = structural subtyping (duck typing formalized). ABC = nominal subtyping. |
| `abstract class` | `abc.ABC` + `@abstractmethod` | Same semantics |
| `final class` | Not native | Convention: `_ClassName` or custom metaclass (rare) |
| `private` fields | `_field` / `__field` | `_` = convention. `__` = name mangling (rarely needed). |
| `getter`/`setter` | `@property` / `@x.setter` | Transparent to client code |
| `static method` | `@staticmethod` | No access to cls/self |
| `factory method` | `@classmethod` | Access to cls for instantiation |
| `enum` | `enum.Enum` | More flexible than Java enums |
| `record` (Java 16) | `@dataclass(frozen=True)` | Immutable Value Objects |
| `Optional<T>` | `T \| None` + type hints | No wrapper needed |
| `Iterable<T>` | `typing.Iterable[T]` | Native duck typing |
| `checked exceptions` | Not in Python | Only unchecked exceptions |
| method overloading | `@singledispatch` or defaults | Not native; use defaults or dispatch |
| `generics <T>` | `TypeVar`, `Generic[T]` | Type hints only; no runtime effect |

## Native Python Tools for Refactoring

| Python Tool | Replaces These Techniques |
|-------------|--------------------------|
| `@property` | Self Encapsulate Field, Encapsulate Field, Replace Temp with Query |
| `@dataclass` | Replace Array with Object, Introduce Parameter Object, Replace Data Value with Object |
| `@dataclass(frozen=True)` | Change Reference to Value, immutable Value Objects |
| `NamedTuple` | Replace Array with Object (lightweight alternative to dataclass) |
| `enum.Enum` | Replace Type Code with Class, Replace Magic Number with Constant |
| `abc.ABC` + `@abstractmethod` | Extract Interface, Form Template Method |
| `typing.Protocol` | Extract Interface (structural subtyping, no inheritance required) |
| `@functools.singledispatch` | Replace Conditional with Polymorphism (functional style) |
| `@functools.lru_cache` | Replace Temp with Query (with memoization for expensive calls) |
| `contextlib.contextmanager` | Resource encapsulation (setup/teardown patterns) |
| List/dict comprehensions | Substitute Algorithm (more pythonic versions) |
| `*args, **kwargs` | Parameter flexibility (use with caution — can hide smells) |

## Idiomatic Patterns

### Extract Method → Free Functions
Python functions are first-class citizens. Not everything needs a class.

```python
# Java-style: extract to class method
# Python-style: free function is perfectly valid
def calculate_discount(price: float, loyalty_years: int) -> float:
    return price * (1 - min(loyalty_years * 0.02, 0.15))
```

### Replace Type Code → `enum.Enum` with behavior

```python
from enum import Enum, auto

class OrderStatus(Enum):
    PENDING = auto()
    CONFIRMED = auto()
    SHIPPED = auto()
    DELIVERED = auto()

    @property
    def is_active(self):
        return self in (OrderStatus.PENDING, OrderStatus.CONFIRMED)
```

### Introduce Parameter Object → `@dataclass`

```python
@dataclass(frozen=True)
class DateRange:
    start: date
    end: date
    def contains(self, d: date) -> bool:
        return self.start <= d <= self.end
    @property
    def days(self) -> int:
        return (self.end - self.start).days
```

### Replace Conditional with Polymorphism → Protocol + dict dispatch

```python
from typing import Protocol

class Formatter(Protocol):
    def format(self, data: dict) -> str: ...

class JSONFormatter:
    def format(self, data: dict) -> str:
        import json; return json.dumps(data)

class CSVFormatter:
    def format(self, data: dict) -> str:
        return ",".join(f"{k}={v}" for k, v in data.items())

FORMATTERS: dict[str, Formatter] = {
    "json": JSONFormatter(),
    "csv": CSVFormatter(),
}

def export(data: dict, fmt: str) -> str:
    formatter = FORMATTERS.get(fmt)
    if not formatter: raise ValueError(f"Unsupported: {fmt}")
    return formatter.format(data)
```

### Encapsulate Field → `@property` with validation

```python
class Temperature:
    def __init__(self, celsius: float):
        self._celsius = celsius

    @property
    def celsius(self) -> float:
        return self._celsius

    @celsius.setter
    def celsius(self, value: float):
        if value < -273.15:
            raise ValueError("Below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self) -> float:
        return self._celsius * 9/5 + 32
```

### Replace Method with Method Object → Callable class

```python
class PriceCalculator:
    def __init__(self, order):
        self.order = order
    def __call__(self) -> float:
        base = self._base_price()
        discount = self._quantity_discount(base)
        return base - discount + self._shipping(base)
    def _base_price(self): return sum(i.price * i.qty for i in self.order.items)
    def _quantity_discount(self, base): return base * 0.1 if base > 1000 else 0
    def _shipping(self, base): return 0 if base > 500 else 50

# Usage: total = PriceCalculator(order)()
```

## Static vs Dynamic Typing Implications

| Aspect | Java (Static) | Python (Dynamic) | Impact on Refactoring |
|--------|---------------|-------------------|----------------------|
| Error detection | Compiler | Runtime + mypy | Use `mypy --strict` as safety net |
| Interfaces | Mandatory | Duck typing | `Protocol` for optional static verification |
| Overloading | Native | Not available | `@singledispatch` or default params |
| Visibility | Enforced (`private`) | Convention (`_`) | Team discipline, not language enforcement |
| Null safety | `Optional<T>` | `T \| None` + mypy | Type hints document intent |
| IDE refactoring | Excellent (IntelliJ) | Good (PyCharm, VS Code) | Tests are more critical as safety net |

## Quality Tools for Safe Refactoring in Python

| Tool | Purpose |
|------|---------|
| `pytest` + `pytest-cov` | Test execution + coverage |
| `mypy --strict` | Static type checking |
| `ruff` | Fast linter (replaces flake8 + isort + pyupgrade) |
| `vulture` | Dead code detection |
| `radon` | Cyclomatic complexity measurement |
| `rope` | Refactoring library (used by IDEs) |
| `pre-commit` | Git hooks for automated quality checks |
