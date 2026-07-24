# Structural Patterns — Operational Reference

## Adapter

**Intent:** Make incompatible interfaces collaborate.
**Also known as:** Wrapper
**Variants:** Object adapter (composition) — preferred. Class adapter (multiple inheritance).

**Structure (object adapter):**
```
Client → ClientInterface ← Adapter → Service
                             wraps Service, translates calls
```

**Python implementation:**
```python
from abc import ABC, abstractmethod
import json

class AnalyzerJSON:  # Existing service — incompatible interface
    def analyze(self, json_data: str) -> dict:
        return json.loads(json_data)

class DataAnalyzer(ABC):  # Interface client expects
    @abstractmethod
    def analyze_xml(self, xml: str) -> dict: ...

class XMLtoJSONAdapter(DataAnalyzer):
    def __init__(self, analyzer: AnalyzerJSON):
        self._analyzer = analyzer
    def analyze_xml(self, xml: str) -> dict:
        json_data = self._convert(xml)
        return self._analyzer.analyze(json_data)
    def _convert(self, xml: str) -> str:
        return '{"data": "converted"}'  # Real conversion here
```

🐍 **Python note:** Duck typing often eliminates the need for formal adapters. Use `__getattr__` to delegate non-adapted attributes transparently.

**When to use:** Integrating legacy/third-party code; reusing subclasses missing common functionality.
**How to implement:** (1) Identify incompatible interfaces → (2) Create adapter class implementing client interface → (3) Adapter stores reference to adaptee → (4) Translate calls in adapter methods.

| ✅ Pros | ❌ Cons |
|---------|---------|
| SRP: separates conversion from business logic | Adds complexity; sometimes simpler to change service |
| OCP: new adapters without breaking client | |

**Relations:** vs. Bridge (anticipatory vs. retroactive). vs. Decorator (changes interface vs. enhances it). vs. Proxy (different interface vs. same interface).
**SOLID:** S, O, D.

---

## Bridge

**Intent:** Split one class into two hierarchies — abstraction and implementation — developed independently.

**Structure:**
```
Abstraction                     Implementation (interface)
  - impl: Implementation          + operationImpl()
  + feature()                        ↑ implements
       ↑ extends                  ConcreteImplementationA/B
RefinedAbstraction
```

**Python implementation:**
```python
from abc import ABC, abstractmethod

class Renderer(ABC):  # Implementation dimension
    @abstractmethod
    def render_circle(self, radius: float) -> str: ...

class SVGRenderer(Renderer):
    def render_circle(self, radius: float) -> str:
        return f"<circle r='{radius}'/>"

class CanvasRenderer(Renderer):
    def render_circle(self, radius: float) -> str:
        return f"canvas.drawCircle({radius})"

class Shape(ABC):  # Abstraction dimension
    def __init__(self, renderer: Renderer):
        self.renderer = renderer
    @abstractmethod
    def draw(self) -> str: ...

class Circle(Shape):
    def __init__(self, radius: float, renderer: Renderer):
        super().__init__(renderer)
        self.radius = radius
    def draw(self) -> str:
        return self.renderer.render_circle(self.radius)

# N shapes × M renderers without N×M classes
```

**When to use:** Combinatorial explosion of subclasses across multiple dimensions; need to switch implementations at runtime; platform-independent abstractions.

| ✅ Pros | ❌ Cons |
|---------|---------|
| Platform-independent code | Overkill for highly cohesive classes |
| OCP: new abstractions and implementations independently | |
| SRP: high-level logic separated from platform details | |

**Relations:** vs. Adapter (anticipatory vs. retroactive). Similar structure to State, Strategy. Complements Abstract Factory.
**SOLID:** S, O, D.

---

## Composite

**Intent:** Compose objects into tree structures; treat individual objects and compositions uniformly.

**Structure:**
```
Component (interface)
  + operation()
       ↑ implements
  Leaf             Composite
  + operation()    - children: Component[]
                   + add(Component), remove(Component)
                   + operation() → for child: child.operation()
```

**Python implementation:**
```python
from abc import ABC, abstractmethod

class OrderComponent(ABC):
    @abstractmethod
    def price(self) -> float: ...

class Product(OrderComponent):
    def __init__(self, name: str, price: float):
        self.name, self._price = name, price
    def price(self) -> float: return self._price

class Box(OrderComponent):
    def __init__(self):
        self._children: list[OrderComponent] = []
    def add(self, c: OrderComponent) -> None:
        self._children.append(c)
    def price(self) -> float:
        return sum(child.price() for child in self._children)
```

**When to use:** Tree/part-whole hierarchies; uniform treatment of leaves and branches.

| ✅ Pros | ❌ Cons |
|---------|---------|
| Polymorphism + recursion simplify tree traversal | Hard to constrain component types |
| OCP: new element types without breaking existing code | May over-generalize interface |

**Relations:** Complements Builder (construct trees), Iterator (traverse), Visitor (operate on tree), CoR (propagate requests up tree). Flyweight for shared leaf nodes.
**SOLID:** O.

---

## Decorator

**Intent:** Add behaviors dynamically by wrapping objects in special wrapper objects.
**Also known as:** Wrapper

**Structure:**
```
Component (interface)
  + operation()
       ↑ implements
ConcreteComponent      BaseDecorator
  + operation()          - wrapped: Component
                         + operation() → wrapped.operation()
                              ↑ extends
                         ConcreteDecorator
                           + operation() → extra + super.operation()
```

**Python implementation:**
```python
from abc import ABC, abstractmethod

class Notifier(ABC):
    @abstractmethod
    def send(self, msg: str) -> None: ...

class EmailNotifier(Notifier):
    def send(self, msg: str) -> None: print(f"📧 {msg}")

class NotifierDecorator(Notifier):
    def __init__(self, wrapped: Notifier):
        self._wrapped = wrapped
    def send(self, msg: str) -> None:
        self._wrapped.send(msg)

class SMSDecorator(NotifierDecorator):
    def send(self, msg: str) -> None:
        super().send(msg)
        print(f"📱 SMS: {msg}")

class SlackDecorator(NotifierDecorator):
    def send(self, msg: str) -> None:
        super().send(msg)
        print(f"💬 Slack: {msg}")

# Stack dynamically: email + sms + slack
notifier = SlackDecorator(SMSDecorator(EmailNotifier()))
```

🐍 **Python `@decorator` vs GoF Decorator:**
- `@decorator` → operates on **functions** at definition time via higher-order functions
- GoF Decorator → operates on **objects** at runtime via composition
- Use `@decorator` for function wrapping; GoF for object behavior stacking

**When to use:** Extend behavior without subclassing; combine behaviors dynamically; avoid combinatorial subclass explosion.

| ✅ Pros | ❌ Cons |
|---------|---------|
| Extend behavior without subclasses | Hard to remove specific wrapper from stack |
| Add/remove at runtime | Behavior may depend on wrapper order |
| SRP: one decorator = one responsibility | Initial config can look complex |

**Relations:** vs. Adapter (changes interface vs. enhances). vs. Proxy (same interface, controls access vs. adds behavior). Similar to Composite (recursive wrapping). vs. Strategy (skin vs. guts).
**SOLID:** S, O.

---

## Facade

**Intent:** Simplified interface to a complex subsystem.

**Python implementation:**
```python
class VideoConverter:
    """Facade for video conversion subsystem."""
    def convert(self, filename: str, fmt: str) -> str:
        file = VideoFile(filename)
        codec = CodecFactory.extract(file)
        result = VideoEncoder().encode(codec, filename)
        result = AudioMixer().fix(result)
        return f"{result}.{fmt}"

# Client only knows VideoConverter, not the 4 subsystem classes
```

🐍 **Python note:** Package `__init__.py` files act as natural facades — re-export only public API.

**When to use:** Shield client from subsystem complexity; provide entry point for layered architecture.

| ✅ Pros | ❌ Cons |
|---------|---------|
| Isolates client from subsystem complexity | Can become a "god object" coupled to everything |

**Relations:** vs. Adapter (wraps one object vs. whole subsystem). Alternative to Abstract Factory (hiding creation). vs. Mediator (no new functionality vs. centralizes communication). Often becomes Singleton.
**SOLID:** D.

---

## Flyweight

**Intent:** Share intrinsic state across objects to reduce RAM usage.

**Key concept:** Separate **intrinsic state** (shared, immutable) from **extrinsic state** (unique, passed as parameter).

**Python implementation:**
```python
class TreeType:
    """Flyweight: intrinsic state (shared)."""
    def __init__(self, name: str, color: str, texture: str):
        self.name, self.color, self.texture = name, color, texture
    def draw(self, x: int, y: int) -> None:
        print(f"Drawing {self.name} at ({x},{y})")

class TreeTypeFactory:
    _types: dict[str, TreeType] = {}
    @classmethod
    def get(cls, name: str, color: str, texture: str) -> TreeType:
        key = f"{name}_{color}_{texture}"
        if key not in cls._types:
            cls._types[key] = TreeType(name, color, texture)
        return cls._types[key]

class Tree:
    """Context: extrinsic state (unique per instance)."""
    def __init__(self, x: int, y: int, tree_type: TreeType):
        self.x, self.y, self.type = x, y, tree_type
```

🐍 **Python tools:** `__slots__` (reduce per-instance memory), `sys.intern()` (deduplicate strings), `functools.lru_cache` (memoize function results as functional flyweight).

**When to use:** Millions of similar objects; significant RAM savings from shared state.

| ✅ Pros | ❌ Cons |
|---------|---------|
| Massive RAM savings | Trades RAM for CPU (recalculate extrinsic state) |
| | Code complexity: intrinsic/extrinsic separation |

**Relations:** Shared Composite leaf nodes. vs. Singleton (1 mutable vs. many immutable).
**SOLID:** S.

---

## Proxy

**Intent:** Substitute controlling access to the real object.
**Types:** Virtual (lazy loading), Protection (access control), Remote, Logging, Caching, Smart Reference.

**Python implementation:**
```python
from abc import ABC, abstractmethod

class Database(ABC):
    @abstractmethod
    def query(self, sql: str) -> list: ...

class RealDatabase(Database):
    def __init__(self):
        print("🔌 Connecting (expensive)...")
    def query(self, sql: str) -> list:
        return [f"result of {sql}"]

class DatabaseProxy(Database):
    """Virtual + Caching + Logging proxy."""
    def __init__(self):
        self._real: RealDatabase | None = None
        self._cache: dict[str, list] = {}

    def query(self, sql: str) -> list:
        print(f"📝 Log: {sql}")
        if sql in self._cache:
            return self._cache[sql]
        if self._real is None:
            self._real = RealDatabase()  # Lazy init
        result = self._real.query(sql)
        self._cache[sql] = result
        return result
```

🐍 **Python tools:** `@property` (attribute proxy), `@cached_property` (lazy + cache), `__getattr__`/`__getattribute__` (transparent delegation).

**When to use:** Lazy loading; access control; caching; logging; remote object representation.

| ✅ Pros | ❌ Cons |
|---------|---------|
| Control service without client awareness | New classes add complexity |
| Manage lifecycle; works when service unavailable | Response delay possible |
| OCP: new proxies without changing service | |

**Relations:** vs. Adapter (different interface). vs. Decorator (same interface, adds behavior vs. controls access). Similar to Facade (both buffer complexity; Proxy = same interface).
**SOLID:** O, S.
