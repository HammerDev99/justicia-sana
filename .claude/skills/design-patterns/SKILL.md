---
name: design-patterns
description: >
  Apply Gang of Four (GoF) design patterns for object-oriented software architecture in Python.
  Use this skill when: the user asks to design, refactor, or review code architecture using
  patterns (Factory, Strategy, Observer, Decorator, etc.); when detecting code smells that
  suggest a pattern-based solution (switch statements → Strategy/State, parallel hierarchies → Bridge);
  when comparing design alternatives; when implementing SOLID principles; or when the user
  mentions "design pattern", "GoF", "creational/structural/behavioral pattern", or any specific
  pattern name. Also use when reviewing architecture decisions or suggesting structural improvements
  to existing code. Do NOT use for simple scripting, algorithm optimization without architectural
  concern, or UI/CSS questions.
---

# Design Patterns — Operational Reference for Python

Based on: *Dive Into Design Patterns* (Alexander Shvets / refactoring.guru)
Covers: 22 GoF patterns + SOLID principles + Python idioms

## How to use this skill

1. **Quick lookup** → Use the tables below to identify the right pattern
2. **Deep detail** → Read the appropriate reference file in `references/`
3. **Code examples** → See `examples/` for complete runnable implementations

## Pattern Catalog — Quick Reference

### Creational Patterns (→ `references/creational-patterns.md`)

| Pattern | Intent | Use when... | 🐍 Python shortcut |
|---------|--------|-------------|---------------------|
| **Factory Method** | Interface for creating objects; subclasses decide the type | Unknown concrete types at compile time; framework extension points | Dict of factories: `FACTORIES[key]()` |
| **Abstract Factory** | Produce families of related objects without concrete classes | Need compatible object families (UI themes, DB drivers) | Modules as factories via `importlib` |
| **Builder** | Construct complex objects step by step | Many optional params; multiple representations | `dataclass` + kwargs; fluent API with method chaining |
| **Prototype** | Copy existing objects without depending on their classes | Need clones with slight variations; avoid costly init | `copy.deepcopy()` — usually sufficient |
| **Singleton** | One instance + global access point | Shared resource (config, pool, logger) | **Module-level variable** — preferred over metaclass |

### Structural Patterns (→ `references/structural-patterns.md`)

| Pattern | Intent | Use when... | 🐍 Python shortcut |
|---------|--------|-------------|---------------------|
| **Adapter** | Make incompatible interfaces work together | Integrating legacy/third-party code with new interface | Duck typing often eliminates need; `__getattr__` delegation |
| **Bridge** | Split class into abstraction + implementation hierarchies | Combinatorial explosion of subclasses (N × M dimensions) | Composition via constructor injection |
| **Composite** | Tree structures treated uniformly | Part-whole hierarchies (file systems, UI, org charts) | Lists + recursion; no shortcut |
| **Decorator** | Add behavior dynamically via wrappers | Stack responsibilities without subclass explosion | `@decorator` for functions; GoF Decorator for objects |
| **Facade** | Simplified interface to complex subsystem | Shield client from subsystem complexity | `__init__.py` as natural facade |
| **Flyweight** | Share intrinsic state across many objects | Millions of similar objects exhausting RAM | `__slots__`, `sys.intern()`, `lru_cache` |
| **Proxy** | Substitute controlling access to real object | Lazy loading, caching, access control, logging | `@property`, `@cached_property`, `__getattr__` |

### Behavioral Patterns (→ `references/behavioral-patterns.md`)

| Pattern | Intent | Use when... | 🐍 Python shortcut |
|---------|--------|-------------|---------------------|
| **Chain of Responsibility** | Pass request along handler chain | Sequential validation/filtering pipeline | Middleware functions |
| **Command** | Encapsulate request as object | Undo/redo, queues, macros, deferred execution | Callables + `functools.partial` (no undo) |
| **Iterator** | Traverse collection without exposing internals | Custom traversal algorithms | **Generators (`yield`)** — native |
| **Mediator** | Centralize communication between components | Complex UI or component interaction graphs | Event bus; `blinker` signals |
| **Memento** | Save/restore state without breaking encapsulation | Undo, snapshots, transactions | `dataclass(frozen=True)` + `copy.deepcopy` |
| **Observer** | Notify subscribers about events | Event-driven systems, pub/sub | Callbacks list; `weakref`; Django signals |
| **State** | Alter behavior when internal state changes | FSM with complex state-dependent behavior | Dict of functions for simple FSMs |
| **Strategy** | Interchangeable algorithm family | Multiple algorithm variants; runtime switching | **First-class functions** — replaces full pattern |
| **Template Method** | Algorithm skeleton with customizable steps | Common workflow with variant steps | `ABC` + `@abstractmethod` + hooks |
| **Visitor** | Add operations without modifying element classes | Multiple operations on stable class hierarchy | `functools.singledispatch` |

## Python Simplification Table

Patterns that simplify drastically in Python vs. classic Java/C++:

| Level | Pattern | Python alternative | When to still use GoF version |
|-------|---------|-------------------|-------------------------------|
| ⭐⭐⭐ Full replace | Strategy | Functions as params | Strategy has internal state or config |
| ⭐⭐⭐ Full replace | Command | Callables + closures | Need undo/redo or command queue |
| ⭐⭐⭐ Full replace | Iterator | Generators + itertools | Need multiple traversal algorithms on same collection |
| ⭐⭐⭐ Full replace | Singleton | Module-level variable | Need lazy initialization or thread safety |
| ⭐⭐ Partial | Observer | Callback lists | Need subscription management, filtering, typed events |
| ⭐⭐ Partial | Decorator | `@decorator` syntax | Need to decorate objects (not functions) with state |
| ⭐⭐ Partial | Proxy | `@property`, descriptors | Need full interface proxy with lifecycle management |
| ⭐⭐ Partial | Prototype | `copy.deepcopy()` | Need prototype registry or custom clone logic |
| ⭐⭐ Partial | Flyweight | `__slots__` + factory | Need explicit intrinsic/extrinsic state separation |
| ⭐ Slight | State | Dict of functions | States have complex behavior or cross-transitions |
| ⭐ Slight | Visitor | `singledispatch` | Need accumulated state across visits |
| ⭐ Slight | Adapter | Duck typing | Interface mismatch still exists after duck typing |
| ⭐ Slight | Builder | `dataclass` + kwargs | Complex multi-step construction with Director |
| — None | Bridge, Composite, Facade, Abstract Factory, Factory Method, CoR, Mediator, Memento, Template Method | — | Always use structured pattern |

## SOLID Principles — Quick Reference

Read `references/solid-principles.md` for full examples and violation signals.

| Principle | Rule | Violation signal | Key patterns |
|-----------|------|------------------|--------------|
| **S** — Single Responsibility | One reason to change per class | God class; hard to name without "and" | Facade, Strategy, Observer, Command |
| **O** — Open/Closed | Extend, don't modify | if/elif chains by type; new feature = edit existing class | Strategy, Decorator, Observer, Factory Method |
| **L** — Liskov Substitution | Subclasses must be substitutable | `isinstance()` checks in client; `NotImplementedError` in subclass | Template Method, Strategy, Factory Method |
| **I** — Interface Segregation | No forced unused methods | Empty method bodies; `pass` implementations | Adapter, Facade, Bridge |
| **D** — Dependency Inversion | Depend on abstractions | `ConcreteClass()` in constructor; can't test without infra | Abstract Factory, Strategy, Bridge, Observer |

## Code Smell → Pattern Decision Map

When you detect a code smell, use this to recommend the right pattern:

| Code Smell | Recommended Pattern(s) | Reasoning |
|-----------|----------------------|-----------|
| Switch/if-elif by type | **Strategy**, **State** | Replace conditionals with polymorphism |
| Parallel inheritance hierarchies | **Bridge** | Separate dimensions into independent hierarchies |
| Feature envy | **Strategy**, **Visitor** | Move behavior to where data lives |
| Large class (God object) | **Facade**, **Mediator**, **Strategy** | Extract responsibilities |
| Long method | **Template Method**, **Strategy**, **Command** | Extract steps or algorithms |
| Divergent change | **Strategy**, **Observer**, **State** | Encapsulate each reason for change |
| Data clumps | **Builder**, **Composite** | Group related data |
| Refused bequest | **Strategy** (composition), **Bridge** | Replace bad inheritance with composition |

## Pattern Relationship Quick Map

Key relationships to consider when recommending patterns:

**Evolutionary chain:** Factory Method → Abstract Factory / Prototype / Builder (complexity grows)

**Structural twins (same mechanism, different intent):**
- Bridge ≈ State ≈ Strategy ≈ Adapter (all use composition)
- Decorator ≈ Proxy ≈ Adapter (all wrap objects)
- CoR ≈ Decorator (recursive delegation chain)

**Complementary pairs:**
- Command + Memento (undo/redo)
- Composite + Iterator + Visitor (tree traversal + operations)
- Builder + Composite (construct complex trees)
- Factory Method + Template Method (FM is a step in TM)

**Alternatives (pick one):**
- Strategy vs. Template Method (composition vs. inheritance)
- State vs. Strategy (transitions vs. independent)
- Adapter vs. Facade (one object vs. subsystem)
- Prototype vs. Memento (cloning for different purposes)

**Emitter-receiver patterns (different connection styles):**
- CoR: sequential chain until handled
- Command: unidirectional sender → receiver
- Mediator: indirect via central hub
- Observer: dynamic subscribe/unsubscribe

Read `references/cross-references.md` for the complete relationship matrices.

## Java/C++ → Python Equivalences

| Java/C++ Concept | Python Equivalent |
|-------------------|-------------------|
| `interface` | `ABC` + `@abstractmethod` or `Protocol` (PEP 544) |
| Abstract class | `ABC` with mixed abstract + concrete methods |
| `enum` | `enum.Enum` |
| Generics `<T>` | `TypeVar`, `Generic` |
| Method overloading | `@singledispatch`, `*args`/`**kwargs` |
| `private` / `protected` | `__field` (mangling) / `_field` (convention) |
| `final` class/method | No enforcement; convention only |

## Workflow for Pattern Selection

When a user needs architectural help:

1. **Identify the problem** — What forces are at play? (flexibility, extensibility, decoupling, performance)
2. **Check smell map** — Does a code smell point to a pattern?
3. **Consult quick reference** — Which pattern addresses the forces?
4. **Check Python table** — Is the full GoF pattern needed, or does Python offer a simpler idiom?
5. **Read reference file** — Load the detailed pattern entry from `references/` for implementation steps
6. **Check relationships** — Are there complementary or alternative patterns to consider?
7. **Implement** — Use example code from `examples/` as starting point

## Reference Files Index

| File | Contents | When to read |
|------|----------|-------------|
| `references/creational-patterns.md` | Factory Method, Abstract Factory, Builder, Prototype, Singleton — full operational detail | Implementing a creational pattern |
| `references/structural-patterns.md` | Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy — full operational detail | Implementing a structural pattern |
| `references/behavioral-patterns.md` | CoR, Command, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor | Implementing a behavioral pattern |
| `references/solid-principles.md` | SOLID with Python examples, violation signals, related patterns | Reviewing code for principle violations |
| `references/cross-references.md` | Pattern×Pattern matrix, SOLID→Pattern matrix, full Java→Python guide | Comparing alternatives or building architecture |
| `examples/*.py` | Runnable reference implementations from refactoring.guru | Need concrete implementation starting point |
