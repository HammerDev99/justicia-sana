# Cross-References — Matrices and Mappings

## Pattern × Pattern Relationships

Legend: 🤝 Complementary | ⚔️ Alternative | 🔄 Evolutionary

### Creational ↔ Creational

| A | Rel | B | Note |
|---|-----|---|------|
| Factory Method | 🔄→ | Abstract Factory | FM evolves to AF for families |
| Factory Method | 🔄→ | Builder | FM evolves when construction gets complex |
| Factory Method | 🔄→ | Prototype | FM evolves when inheritance is unwanted |
| Abstract Factory | ⚔️ | Builder | AF returns immediately; Builder allows steps |
| Abstract Factory | 🤝 | Prototype | AF methods can use Prototype internally |
| Abstract Factory | 🤝 | Singleton | Concrete factories are often Singletons |
| Prototype | ⚔️ | Factory Method | Prototype avoids inheritance; FM requires it |

### Creational ↔ Structural

| A | Rel | B | Note |
|---|-----|---|------|
| Abstract Factory | ⚔️ | Facade | AF hides creation; Facade hides subsystem |
| Abstract Factory | 🤝 | Bridge | AF encapsulates Bridge abstraction↔implementation pairs |
| Builder | 🤝 | Composite | Build Composite trees recursively |
| Builder | 🤝 | Bridge | Director=abstraction, Builders=implementation |
| Prototype | 🤝 | Composite+Decorator | Clone complex structures instead of rebuilding |
| Singleton | 🤝 | Facade | Facades are often Singletons |
| Singleton | ⚔️ | Flyweight | 1 mutable instance vs. many immutable |

### Structural ↔ Structural

| A | Rel | B | Note |
|---|-----|---|------|
| Adapter | ⚔️ | Bridge | Retroactive vs. anticipatory |
| Adapter | ⚔️ | Decorator | Changes interface vs. enhances interface |
| Adapter | ⚔️ | Proxy | Different interface vs. same interface |
| Composite | 🤝 | Flyweight | Shared leaf nodes |
| Composite | 🤝 | Decorator | Both use recursive composition |
| Decorator | ⚔️ | Proxy | Add behavior vs. control access |
| Facade | ⚔️ | Flyweight | One object for subsystem vs. many small objects |
| Facade | 🔗 | Mediator | Both organize collaboration; Facade=simplify, Mediator=centralize |

### Behavioral ↔ Behavioral

| A | Rel | B | Note |
|---|-----|---|------|
| CoR+Command+Mediator+Observer | 🔗 | each other | Four sender↔receiver connection styles |
| Command | 🤝 | Memento | Execute + save state for undo |
| Command | ⚔️ | Strategy | Both parameterize; Command=request, Strategy=algorithm |
| Command | 🔗 | Visitor | Visitor = powerful Command for multiple types |
| Iterator | 🤝 | Composite | Traverse trees |
| Iterator | 🤝 | Memento | Save iteration state |
| Iterator | 🤝 | Visitor | Traverse + operate |
| Mediator | 🔗 | Observer | Mediator often implemented using Observer |
| State | 🤝 | Strategy | Same structure; State allows transitions, Strategy doesn't |
| Strategy | ⚔️ | Template Method | Composition/runtime vs. inheritance/static |
| Factory Method | 🤝 | Template Method | FM is a specialization of TM |

### Behavioral ↔ Structural

| A | Rel | B | Note |
|---|-----|---|------|
| CoR | 🤝 | Composite | Requests propagate up the tree |
| CoR | 🔗 | Decorator | Similar chain structure; CoR can stop |
| Visitor | 🤝 | Composite | Operate on entire tree |
| State/Strategy | 🔗 | Bridge | Same composition mechanism, different intent |
| Iterator | 🤝 | Factory Method | Subclasses return typed iterators |

---

## SOLID → Pattern Matrix

| Principle | Patterns that facilitate it |
|-----------|---------------------------|
| **S** (SRP) | Facade, Strategy, Observer, Command, Mediator, CoR, Builder, Decorator, State, Visitor |
| **O** (OCP) | Strategy, Observer, Decorator, Factory Method, Template Method, CoR, Command, Bridge, Visitor, Proxy, Iterator |
| **L** (LSP) | Template Method, Strategy, Factory Method, State |
| **I** (ISP) | Adapter, Facade, Proxy, Bridge |
| **D** (DIP) | Abstract Factory, Strategy, Bridge, Observer, Factory Method |

---

## Code Smell → Pattern Matrix

| Smell | Pattern | How it resolves |
|-------|---------|----------------|
| Switch statements / type-checking conditionals | **Strategy**, **State** | Polymorphism replaces conditionals |
| Parallel inheritance hierarchies | **Bridge** | Independent dimension hierarchies |
| Feature envy | **Strategy**, **Visitor** | Move behavior where data lives |
| Large class / God object | **Facade**, **Mediator**, **Strategy** | Extract responsibilities |
| Long method | **Template Method**, **Strategy**, **Command** | Extract steps/algorithms |
| Divergent change (many reasons to change) | **Strategy**, **Observer**, **State** | Encapsulate change reasons separately |
| Shotgun surgery (1 change → many files) | **Facade**, **Mediator** | Centralize coordination |
| Data clumps | **Builder**, **Composite** | Group related data into objects |
| Primitive obsession | **Factory Method**, **Builder** | Rich domain objects |
| Refused bequest (subclass ignores parent) | **Strategy**, **Bridge** | Replace inheritance with composition |
| Message chains (a.b().c().d()) | **Facade** | Simplified access point |
| Speculative generality | Remove unnecessary pattern | Simplify; YAGNI |

---

## Refactoring → Pattern Mapping

| Refactoring Technique | Often leads to... |
|----------------------|-------------------|
| Extract Class | Strategy, State, Command |
| Replace Conditional with Polymorphism | Strategy, State |
| Introduce Parameter Object | Builder |
| Extract Interface | Adapter, Bridge, Strategy |
| Replace Inheritance with Delegation | Strategy, Bridge, Decorator |

---

## Java/C++ → Python Full Equivalence Table

| Java/C++ | Python | Notes |
|----------|--------|-------|
| `interface` | `ABC` + `@abstractmethod` | Formal interface |
| `interface` (duck typed) | `Protocol` (PEP 544) | Structural subtyping; no inheritance needed |
| Abstract class | `ABC` with abstract + concrete methods | Same concept |
| `enum` | `enum.Enum` | With methods and properties |
| Generics `<T>` | `TypeVar`, `Generic` | `from typing import TypeVar, Generic` |
| Method overloading | `@singledispatch`, `*args`/`**kwargs` | No native overloading |
| `private` | `__field` (name mangling) | Convention, not enforcement |
| `protected` | `_field` | Convention only |
| `public` | `field` | Default |
| `final class` | No equivalent | Simulate with metaclass |
| `final method` | No equivalent | Document convention |
| `static method` | `@staticmethod` | |
| Class factory method | `@classmethod` | |
| `synchronized` | `threading.Lock` | Context manager pattern |
| Inner/nested class | Nested class or closure | Less common in Python |
| `try-with-resources` | `with` statement (context manager) | Pythonic pattern |
