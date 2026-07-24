# Creational Patterns — Operational Reference

## Factory Method

**Intent:** Interface for creating objects in a superclass; subclasses alter the type created.
**Also known as:** Virtual Constructor

**Structure:**
```
Creator (abstract)          Product (interface)
  + createProduct(): Product    + operation()
  + businessLogic()              ↑ implements
       ↑ extends              ConcreteProduct
ConcreteCreator                  + operation()
  + createProduct() → return ConcreteProduct()
```

**Python implementation:**
```python
from abc import ABC, abstractmethod

class Transporte(ABC):
    @abstractmethod
    def entregar(self, carga: str) -> str: ...

class Camion(Transporte):
    def entregar(self, carga: str) -> str:
        return f"Entrega terrestre: {carga}"

class Barco(Transporte):
    def entregar(self, carga: str) -> str:
        return f"Entrega marítima: {carga}"

class Logistica(ABC):
    @abstractmethod
    def crear_transporte(self) -> Transporte: ...

    def planificar(self, carga: str) -> str:
        return self.crear_transporte().entregar(carga)

class LogisticaTerrestre(Logistica):
    def crear_transporte(self) -> Transporte: return Camion()

class LogisticaMaritima(Logistica):
    def crear_transporte(self) -> Transporte: return Barco()
```

🐍 **Pythonic alternative:** `FACTORIES: dict[str, type[Product]] = {"land": Truck, "sea": Ship}` — use dict lookup when subclass hierarchy is overkill.

**When to use:** Unknown types at compile time; framework extension points; object pooling/reuse.
**How to implement:** (1) All products follow same interface → (2) Add abstract factory method to creator → (3) Replace direct `new`/constructor calls → (4) One subclass per product type → (5) If empty base, make abstract.

| ✅ Pros | ❌ Cons |
|---------|---------|
| Decouples creator from concrete products | Many subclasses for many product types |
| SRP: centralizes creation | Requires existing creator hierarchy |
| OCP: new products without breaking client | |

**Relations:** Evolves → Abstract Factory, Prototype, Builder. Specialization of Template Method. Complements Iterator (subclass returns typed iterators).
**SOLID:** S, O, D.

---

## Abstract Factory

**Intent:** Produce families of related objects without specifying concrete classes.
**Also known as:** Kit

**Structure:**
```
AbstractFactory (interface)          AbstractProductA / AbstractProductB
  + createProductA(): ProductA         ↑ implements
  + createProductB(): ProductB       ConcreteProductA1, ConcreteProductA2...
       ↑ implements
ConcreteFactory1, ConcreteFactory2
```

**Python implementation:**
```python
from abc import ABC, abstractmethod

class Button(ABC):
    @abstractmethod
    def render(self) -> str: ...

class Checkbox(ABC):
    @abstractmethod
    def check(self) -> str: ...

class GUIFactory(ABC):
    @abstractmethod
    def create_button(self) -> Button: ...
    @abstractmethod
    def create_checkbox(self) -> Checkbox: ...

class WindowsButton(Button):
    def render(self) -> str: return "Windows button"
class WindowsCheckbox(Checkbox):
    def check(self) -> str: return "Windows checkbox"

class WindowsFactory(GUIFactory):
    def create_button(self) -> Button: return WindowsButton()
    def create_checkbox(self) -> Checkbox: return WindowsCheckbox()

# Client depends only on GUIFactory + Button + Checkbox abstractions
def build_ui(factory: GUIFactory) -> None:
    button = factory.create_button()
    checkbox = factory.create_checkbox()
```

🐍 **Pythonic alternative:** Modules as factories — `import ui_windows as ui_module`, then `ui_module.create_button()`.

**When to use:** Code must work with product families without coupling to concretes; ensuring compatible products.
**How to implement:** (1) Map product types × variants matrix → (2) Abstract interfaces per product type → (3) Abstract factory with creation methods → (4) Concrete factory per variant → (5) Client initialization selects factory.

| ✅ Pros | ❌ Cons |
|---------|---------|
| Guarantees compatible products | Many new interfaces and classes |
| SRP, OCP, DIP | Overkill for single product family |

**Relations:** Evolves from Factory Method. Complements Bridge, Singleton. Alternative to Facade for hiding creation.
**SOLID:** S, O, D.

---

## Builder

**Intent:** Construct complex objects step by step; same process creates different representations.

**Structure:**
```
Director (optional)          Builder (interface)
  - builder: Builder           + reset()
  + construct()                + buildStepA()
                               + buildStepB()
                               + getResult(): Product
                                  ↑ implements
                               ConcreteBuilder
```

**Python implementation:**
```python
from __future__ import annotations
from dataclasses import dataclass

@dataclass
class House:
    walls: int = 0; doors: int = 0; windows: int = 0
    garage: bool = False; pool: bool = False

class HouseBuilder:
    def __init__(self) -> None:
        self._house = House()

    def reset(self) -> HouseBuilder:
        self._house = House(); return self

    def walls(self, n: int) -> HouseBuilder:
        self._house.walls = n; return self

    def doors(self, n: int) -> HouseBuilder:
        self._house.doors = n; return self

    def with_garage(self) -> HouseBuilder:
        self._house.garage = True; return self

    def build(self) -> House:
        result = self._house; self.reset(); return result

# Fluent API usage
house = HouseBuilder().walls(4).doors(2).with_garage().build()
```

🐍 **Pythonic alternative:** `@dataclass` with default values + `**kwargs` handles most cases. Use Builder when: construction requires multiple steps with validation, or Director pattern defines reusable construction sequences.

**When to use:** Many optional params (telescoping constructor); multiple representations; step-by-step construction with validation.

| ✅ Pros | ❌ Cons |
|---------|---------|
| Step-by-step, deferred, recursive construction | Extra classes for simple objects |
| Reuse construction code across representations | |
| SRP: isolates construction from business logic | |

**Relations:** Evolves from Factory Method. Complements Composite (recursive trees), Bridge (director=abstraction, builders=implementation).
**SOLID:** S, O.

---

## Prototype

**Intent:** Copy existing objects without depending on their classes.
**Also known as:** Clone

**Structure:**
```
Prototype (interface)
  + clone(): Prototype
       ↑ implements
ConcretePrototype
  + clone() → return copy(this)
```

**Python implementation:**
```python
import copy

class Shape:
    def __init__(self, x: int = 0, y: int = 0, color: str = "black"):
        self.x, self.y, self.color = x, y, color

    def clone(self) -> "Shape":
        return copy.deepcopy(self)

class Circle(Shape):
    def __init__(self, radius: float, **kwargs):
        super().__init__(**kwargs)
        self.radius = radius

# Optional prototype registry
class PrototypeRegistry:
    def __init__(self):
        self._protos: dict[str, Shape] = {}
    def register(self, name: str, proto: Shape) -> None:
        self._protos[name] = proto
    def create(self, name: str) -> Shape:
        return self._protos[name].clone()
```

🐍 **Python note:** `copy.deepcopy()` is almost always sufficient. Customize with `__copy__` / `__deepcopy__` for special cases (circular refs, resource handles).

**When to use:** Avoid depending on concrete classes for copying; reduce subclasses that differ only in initialization.

| ✅ Pros | ❌ Cons |
|---------|---------|
| Clone without coupling to concrete classes | Complex objects with circular refs are tricky |
| Eliminate repetitive initialization | |

**Relations:** Alternative to Memento (simple state save). Complements Composite + Decorator (clone complex structures). With Command (copy commands for history).
**SOLID:** O, D.

---

## Singleton

**Intent:** Ensure one instance + global access point.

⚠️ **Controversial pattern.** Violates SRP (solves two problems). Consider **dependency injection** first.

**Python implementations (3 approaches):**

```python
# Approach 1: Metaclass (thread-safe with Lock)
from threading import Lock

class SingletonMeta(type):
    _instances: dict = {}
    _lock: Lock = Lock()
    def __call__(cls, *args, **kwargs):
        with cls._lock:
            if cls not in cls._instances:
                cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class Database(metaclass=SingletonMeta):
    def __init__(self): self.connection = "connected"

# Approach 2: __new__
class Logger:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

# Approach 3 (PREFERRED): Module as singleton
# config.py
_settings: dict = {}
def get(key: str) -> str: return _settings.get(key, "")
def set(key: str, value: str) -> None: _settings[key] = value
```

🐍 **Best practice:** Use a plain module. Modules are singletons by nature in Python.

**When to use:** Shared resource control (config, connection pool). When to AVOID: most other cases — prefer DI.

| ✅ Pros | ❌ Cons |
|---------|---------|
| Guaranteed single instance | Violates SRP |
| Lazy initialization | Masks bad design (hidden dependencies) |
| | Difficult to test (global state) |
| | Thread safety complexity |

**Relations:** Facade often becomes Singleton. Factories often implemented as Singletons. Different from Flyweight (multiple immutable instances).
**SOLID:** ❌ Violates S. ⚠️ Can violate D if accessed directly.
