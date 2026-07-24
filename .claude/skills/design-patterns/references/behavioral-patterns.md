# Behavioral Patterns — Operational Reference

## Chain of Responsibility

**Intent:** Pass requests along a chain of handlers; each decides to process or pass on.
**Also known as:** CoR, Chain of Command

**Structure:**
```
Handler (interface) → set_next(Handler), handle(request)
  ↑ implements
BaseHandler (next: Handler) → if can't handle: next.handle()
  ↑ extends
ConcreteHandlerA, ConcreteHandlerB...
```

**Python implementation:**
```python
from abc import ABC, abstractmethod

class Handler(ABC):
    def __init__(self):
        self._next: Handler | None = None
    def set_next(self, h: "Handler") -> "Handler":
        self._next = h; return h
    @abstractmethod
    def handle(self, request: dict) -> str | None: ...
    def pass_next(self, request: dict) -> str | None:
        return self._next.handle(request) if self._next else "✅ Passed all checks"

class AuthHandler(Handler):
    def handle(self, request: dict) -> str | None:
        if not request.get("authenticated"):
            return "❌ Auth failed"
        return self.pass_next(request)

class RateLimitHandler(Handler):
    def handle(self, request: dict) -> str | None:
        if request.get("rate") and request["rate"] > 100:
            return "❌ Rate limit exceeded"
        return self.pass_next(request)

# Build chain
auth = AuthHandler()
auth.set_next(RateLimitHandler())
```

🐍 **Pythonic alternative:** List of handler functions iterated sequentially; decorator-based middleware pipelines.

**When to use:** Sequential validation/processing pipelines; order of handlers varies at runtime.
| ✅ Pros | ❌ Cons |
|---------|---------|
| SRP, OCP: each handler independent | Some requests may go unhandled |

**Relations:** Complements Composite (propagate up tree). CoR/Command/Mediator/Observer all connect senders↔receivers differently. vs. Decorator (CoR can stop; Decorator always delegates).
**SOLID:** S, O.

---

## Command

**Intent:** Encapsulate request as object — enables parameterization, queuing, undo/redo.
**Also known as:** Action, Transaction

**Structure:**
```
Invoker → Command.execute()
Command (interface): execute(), undo()
ConcreteCommand: stores Receiver + params
Receiver: does the actual work
```

**Python implementation:**
```python
from abc import ABC, abstractmethod

class Command(ABC):
    @abstractmethod
    def execute(self) -> None: ...
    @abstractmethod
    def undo(self) -> None: ...

class Editor:
    def __init__(self): self.text = ""
    def insert(self, t: str) -> None: self.text += t
    def delete_last(self, n: int) -> str:
        removed = self.text[-n:]; self.text = self.text[:-n]; return removed

class InsertText(Command):
    def __init__(self, editor: Editor, text: str):
        self._editor, self._text = editor, text
    def execute(self) -> None: self._editor.insert(self._text)
    def undo(self) -> None: self._editor.delete_last(len(self._text))

class History:
    def __init__(self): self._stack: list[Command] = []
    def execute(self, cmd: Command) -> None:
        cmd.execute(); self._stack.append(cmd)
    def undo(self) -> None:
        if self._stack: self._stack.pop().undo()
```

🐍 **Pythonic alternative (no undo):** Callables, closures, `functools.partial` — use the full pattern only when you need undo/redo or command queues.

**When to use:** Undo/redo; deferred execution; command queues; macro recording; transaction logging.
| ✅ Pros | ❌ Cons |
|---------|---------|
| SRP, OCP; undo/redo; deferred execution; macros | New layer between sender and receiver |

**Relations:** With Memento (save state before execute for undo). vs. Strategy (both parameterize with action; Command = full request, Strategy = algorithm). CoR handlers can be Commands.
**SOLID:** S, O.

---

## Iterator

**Intent:** Traverse collection elements without exposing internal representation.
**Also known as:** Cursor

🐍 **Python makes this pattern native.** Generators (`yield`), `__iter__`/`__next__` protocol, `itertools`, and comprehensions cover 99% of use cases.

**Python implementation:**
```python
from collections.abc import Iterator, Iterable
from typing import Any

class BinaryTree:
    def __init__(self, value, left=None, right=None):
        self.value, self.left, self.right = value, left, right

    def inorder(self):
        """Generator-based iterator — the Pythonic way."""
        if self.left: yield from self.left.inorder()
        yield self.value
        if self.right: yield from self.right.inorder()

    def __iter__(self):
        return self.inorder()

# Usage: for node in tree: print(node)
```

**When to use full GoF version:** Multiple traversal algorithms on the same collection; need to expose different iteration strategies.
| ✅ Pros | ❌ Cons |
|---------|---------|
| SRP, OCP; parallel iteration; pausable | Overkill for simple collections |

**Relations:** Complements Composite (traverse trees), Factory Method (typed iterators), Memento (save iteration state), Visitor (traverse + operate).
**SOLID:** S, O.

---

## Mediator

**Intent:** Reduce chaotic dependencies — components communicate only through a mediator.
**Also known as:** Controller

**Python implementation:**
```python
from abc import ABC, abstractmethod

class Mediator(ABC):
    @abstractmethod
    def notify(self, sender: "Component", event: str) -> None: ...

class Component:
    def __init__(self, mediator: Mediator | None = None):
        self._mediator = mediator
    def set_mediator(self, m: Mediator) -> None: self._mediator = m

class Checkbox(Component):
    def __init__(self): super().__init__(); self.checked = False
    def toggle(self) -> None:
        self.checked = not self.checked
        if self._mediator: self._mediator.notify(self, "toggle")

class SubmitButton(Component):
    def __init__(self): super().__init__(); self.enabled = False

class RegistrationDialog(Mediator):
    def __init__(self):
        self.checkbox = Checkbox()
        self.button = SubmitButton()
        self.checkbox.set_mediator(self)
    def notify(self, sender: Component, event: str) -> None:
        if isinstance(sender, Checkbox) and event == "toggle":
            self.button.enabled = sender.checked
```

🐍 **Pythonic alternatives:** Event buses, `blinker` signals, Django signals, Qt signal/slot.

**When to use:** Complex component interactions; reduce coupling between tightly connected classes.
| ✅ Pros | ❌ Cons |
|---------|---------|
| SRP, OCP; reduced coupling; reusable components | Can become "god object" |

**Relations:** vs. Facade (simplified interface without new functionality vs. centralized communication). Mediator often implemented using Observer internally. CoR/Command/Mediator/Observer: different sender↔receiver styles.
**SOLID:** S, O.

---

## Memento

**Intent:** Save and restore object state without breaking encapsulation.
**Also known as:** Snapshot

**Structure:** Originator (creates mementos from its state) → Memento (immutable snapshot) ← Caretaker (stores mementos, never reads content)

**Python implementation:**
```python
from dataclasses import dataclass, field
from datetime import datetime

@dataclass(frozen=True)
class EditorMemento:
    text: str
    cursor: int
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())

class TextEditor:
    def __init__(self): self.text, self.cursor = "", 0
    def write(self, t: str) -> None:
        self.text += t; self.cursor += len(t)
    def save(self) -> EditorMemento:
        return EditorMemento(self.text, self.cursor)
    def restore(self, m: EditorMemento) -> None:
        self.text, self.cursor = m.text, m.cursor

class History:
    def __init__(self): self._snapshots: list[EditorMemento] = []
    def push(self, m: EditorMemento) -> None: self._snapshots.append(m)
    def pop(self) -> EditorMemento | None:
        return self._snapshots.pop() if self._snapshots else None
```

🐍 **Python tools:** `dataclass(frozen=True)` for immutable snapshots, `copy.deepcopy` for complex state, `pickle`/`json` for serialization.

**When to use:** Undo/snapshots; transactions that may need rollback.
| ✅ Pros | ❌ Cons |
|---------|---------|
| Snapshots without breaking encapsulation | RAM-heavy if frequent snapshots |
| | Dynamic languages can't guarantee memento integrity |

**Relations:** With Command (undo: Command executes, Memento saves prior state). With Iterator (save iteration state). Alternative to Prototype (for simple objects).
**SOLID:** S.

---

## Observer

**Intent:** Subscription mechanism to notify multiple objects about events.
**Also known as:** Event-Subscriber, Listener, Pub/Sub

**Python implementation:**
```python
from abc import ABC, abstractmethod

class EventManager:
    def __init__(self):
        self._listeners: dict[str, list["Listener"]] = {}
    def subscribe(self, event: str, listener: "Listener") -> None:
        self._listeners.setdefault(event, []).append(listener)
    def unsubscribe(self, event: str, listener: "Listener") -> None:
        self._listeners.get(event, []).remove(listener)
    def notify(self, event: str, data: dict) -> None:
        for l in self._listeners.get(event, []):
            l.update(event, data)

class Listener(ABC):
    @abstractmethod
    def update(self, event: str, data: dict) -> None: ...

class FileEditor:
    def __init__(self):
        self.events = EventManager()
    def save(self, path: str) -> None:
        self.events.notify("save", {"path": path})

class LogListener(Listener):
    def update(self, event: str, data: dict) -> None:
        print(f"📝 Log: {event} — {data}")
```

🐍 **Python tools:** Simple callback lists, `weakref` (avoid memory leaks), `PyPubSub`, Django `dispatch`, Qt signals, `asyncio` for async Observer.

**When to use:** Event-driven systems; loose coupling between components; dynamic subscription.
| ✅ Pros | ❌ Cons |
|---------|---------|
| OCP: new subscribers without changing publisher | Random notification order |
| Dynamic runtime relationships | Memory leaks if not unsubscribed |

**Relations:** CoR/Command/Mediator/Observer: different sender↔receiver styles. Mediator vs. Observer boundary is blurry — Mediator often uses Observer internally.
**SOLID:** O.

---

## State

**Intent:** Object alters behavior when internal state changes — appears to change class.
**Related concept:** Finite State Machine (FSM)

**Python implementation:**
```python
from abc import ABC, abstractmethod

class State(ABC):
    @abstractmethod
    def play(self, player: "Player") -> None: ...
    @abstractmethod
    def stop(self, player: "Player") -> None: ...

class Stopped(State):
    def play(self, player: "Player") -> None:
        print("▶️ Playing"); player.state = Playing()
    def stop(self, player: "Player") -> None:
        print("Already stopped")

class Playing(State):
    def play(self, player: "Player") -> None:
        print("Already playing")
    def stop(self, player: "Player") -> None:
        print("⏹️ Stopping"); player.state = Stopped()

class Player:
    def __init__(self): self.state: State = Stopped()
    def play(self) -> None: self.state.play(self)
    def stop(self) -> None: self.state.stop(self)
```

🐍 **Pythonic alternatives:** Dict of functions per state; `enum` + dispatch; `transitions` library for complex FSMs.

**When to use:** Object behavior depends heavily on state; many conditionals switching on state; states have complex behavior.
| ✅ Pros | ❌ Cons |
|---------|---------|
| SRP, OCP; eliminates state-conditional bloat | Overkill for few states or rare transitions |

**Relations:** Similar structure to Bridge/Strategy/Adapter (all composition-based). State = extension of Strategy where states know about each other and trigger transitions.
**SOLID:** S, O.

---

## Strategy

**Intent:** Family of interchangeable algorithms.
**Also known as:** Policy

**Python implementation — two versions:**
```python
# Classic OOP version (use when strategies have state/config)
from abc import ABC, abstractmethod

class RouteStrategy(ABC):
    @abstractmethod
    def calculate(self, origin: str, dest: str) -> str: ...

class CarRoute(RouteStrategy):
    def calculate(self, origin: str, dest: str) -> str:
        return f"🚗 {origin} → highway → {dest}"

class Navigator:
    def __init__(self, strategy: RouteStrategy):
        self._strategy = strategy
    def navigate(self, origin: str, dest: str) -> str:
        return self._strategy.calculate(origin, dest)
```

```python
# Pythonic version (use when strategies are stateless)
from typing import Callable

def car_route(origin: str, dest: str) -> str:
    return f"🚗 {origin} → highway → {dest}"

def walk_route(origin: str, dest: str) -> str:
    return f"🚶 {origin} → park → {dest}"

class Navigator:
    def __init__(self, strategy: Callable[[str, str], str]):
        self._strategy = strategy
    def navigate(self, origin: str, dest: str) -> str:
        return self._strategy(origin, dest)

nav = Navigator(car_route)
```

**When to use:** Multiple algorithm variants; switch algorithms at runtime; isolate algorithm implementation.
| ✅ Pros | ❌ Cons |
|---------|---------|
| Runtime algorithm switching; OCP | Overkill for few stable algorithms |
| Composition over inheritance | Clients must know strategy differences |

**Relations:** vs. Template Method (composition/runtime vs. inheritance/static). vs. Command (both parameterize; Command=request, Strategy=algorithm). vs. State (strategies independent; states know each other). Similar structure to Bridge.
**SOLID:** O, D.

---

## Template Method

**Intent:** Algorithm skeleton in superclass; subclasses override specific steps.

**Python implementation:**
```python
from abc import ABC, abstractmethod

class DataMiner(ABC):
    def mine(self, path: str) -> dict:  # Template method
        raw = self.extract(path)
        data = self.parse(raw)
        analysis = self.analyze(data)
        self.hook_post(analysis)  # Optional hook
        return analysis

    @abstractmethod
    def extract(self, path: str) -> str: ...
    @abstractmethod
    def parse(self, raw: str) -> list: ...

    def analyze(self, data: list) -> dict:  # Default implementation
        return {"count": len(data), "data": data}

    def hook_post(self, analysis: dict) -> None:  # Hook: override optionally
        pass

class CSVMiner(DataMiner):
    def extract(self, path: str) -> str: return "col1,col2\nv1,v2"
    def parse(self, raw: str) -> list:
        return [line.split(",") for line in raw.split("\n")]
```

**When to use:** Common algorithm structure with variant steps; eliminate duplicate code in similar classes.
| ✅ Pros | ❌ Cons |
|---------|---------|
| Centralize common code in superclass | Clients limited by fixed skeleton |
| Clients override only needed steps | May violate LSP via suppressed steps |

**Relations:** Factory Method is a specialization of Template Method. vs. Strategy (inheritance/static vs. composition/dynamic).
**SOLID:** O.

---

## Visitor

**Intent:** Separate algorithms from the objects they operate on — add operations without modifying element classes.
**Key mechanism:** Double dispatch (element.accept(visitor) → visitor.visitElement(this))

⚠️ **Complex pattern — use sparingly.** Best when element hierarchy is stable but operations change frequently.

**Python implementation:**
```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def accept(self, visitor: "ShapeVisitor") -> str: ...

class Circle(Shape):
    def __init__(self, radius: float): self.radius = radius
    def accept(self, visitor: "ShapeVisitor") -> str:
        return visitor.visit_circle(self)

class Rectangle(Shape):
    def __init__(self, w: float, h: float): self.w, self.h = w, h
    def accept(self, visitor: "ShapeVisitor") -> str:
        return visitor.visit_rectangle(self)

class ShapeVisitor(ABC):
    @abstractmethod
    def visit_circle(self, c: Circle) -> str: ...
    @abstractmethod
    def visit_rectangle(self, r: Rectangle) -> str: ...

class XMLExport(ShapeVisitor):
    def visit_circle(self, c: Circle) -> str:
        return f"<circle r='{c.radius}'/>"
    def visit_rectangle(self, r: Rectangle) -> str:
        return f"<rect w='{r.w}' h='{r.h}'/>"
```

🐍 **Pythonic alternative:** `functools.singledispatch` provides type-based dispatch without double dispatch:
```python
from functools import singledispatch

@singledispatch
def export_xml(shape) -> str:
    raise NotImplementedError
@export_xml.register(Circle)
def _(c: Circle) -> str: return f"<circle r='{c.radius}'/>"
```

**When to use:** Multiple operations on stable hierarchy; can't modify element classes; accumulate info across traversal.
| ✅ Pros | ❌ Cons |
|---------|---------|
| OCP, SRP for operations; accumulate state | Must update all visitors when elements change |
| | Visitors may lack access to private fields |

**Relations:** Powerful version of Command (operate on different types). Complements Composite (whole tree) and Iterator (traverse + operate).
**SOLID:** S, O.
