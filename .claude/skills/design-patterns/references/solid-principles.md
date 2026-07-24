# SOLID Principles — Operational Reference

## S — Single Responsibility Principle (SRP)

**Rule:** A class should have only one reason to change.

**Violation → Fix:**
```python
# ❌ BEFORE: Multiple responsibilities
class Empleado:
    def calcular_pago(self) -> float: ...      # Payroll logic
    def guardar_en_bd(self) -> None: ...        # Persistence
    def generar_reporte(self) -> str: ...       # Reporting

# ✅ AFTER: One responsibility each
class Empleado:
    def __init__(self, nombre: str, salario: float): ...

class CalculadoraNomina:
    def calcular_pago(self, emp: Empleado) -> float: ...

class EmpleadoRepositorio:
    def guardar(self, emp: Empleado) -> None: ...

class GeneradorReportes:
    def generar(self, emp: Empleado) -> str: ...
```

**Violation signals:** Class has 5+ unrelated public methods; hard to name without "and/or"; changes in one feature require modifying same class as another feature; tests need many unrelated mocks.

**Patterns that help:** Facade, Strategy, Observer, Command, Mediator, Chain of Responsibility, Builder, Decorator, State, Visitor.

---

## O — Open/Closed Principle (OCP)

**Rule:** Open for extension, closed for modification.

**Violation → Fix:**
```python
# ❌ BEFORE: New shipping = modify existing class
class Pedido:
    def calcular_envio(self, tipo: str) -> float:
        if tipo == "terrestre": return self.peso * 1.5
        elif tipo == "aereo": return self.peso * 3.0
        # Every new type modifies this method

# ✅ AFTER: New shipping = new class only
from abc import ABC, abstractmethod

class MetodoEnvio(ABC):
    @abstractmethod
    def calcular_costo(self, peso: float) -> float: ...

class EnvioTerrestre(MetodoEnvio):
    def calcular_costo(self, peso: float) -> float: return peso * 1.5

class EnvioMaritimo(MetodoEnvio):  # NEW — no existing code modified
    def calcular_costo(self, peso: float) -> float: return peso * 0.8

class Pedido:
    def __init__(self, peso: float, envio: MetodoEnvio):
        self.peso, self.envio = peso, envio
    def calcular_envio(self) -> float:
        return self.envio.calcular_costo(self.peso)
```

**Violation signals:** Long if/elif/else chains by type; every new feature requires editing existing classes; changes ripple across multiple files.

**Patterns that help:** Strategy, Observer, Decorator, Factory Method, Template Method, CoR, Command, Bridge, Visitor, Proxy, Iterator.

---

## L — Liskov Substitution Principle (LSP)

**Rule:** Subclass objects must be usable in place of superclass objects without breaking the program.

**Formal requirements:**
1. Parameter types in subclass: same or more abstract (contravariance)
2. Return types: same or more specific (covariance)
3. No unexpected exceptions
4. Don't strengthen preconditions
5. Don't weaken postconditions
6. Preserve invariants
7. Don't change private superclass fields

**Violation → Fix:**
```python
# ❌ BEFORE: ReadOnlyDoc breaks Document.save() contract
class Document:
    def save(self, content: str) -> None: print(f"Saving: {content}")

class ReadOnlyDocument(Document):
    def save(self, content: str) -> None:
        raise PermissionError("Cannot save read-only")  # BREAKS client code

# ✅ AFTER: ReadOnly is the base; Editable extends
class ReadableDocument:
    def open(self) -> str: return "opened"

class EditableDocument(ReadableDocument):
    def save(self, content: str) -> None: print(f"Saving: {content}")
```

**Violation signals:** Subclasses that raise `NotImplementedError`; client code uses `isinstance()` to decide behavior; subclass restricts superclass functionality.

**Patterns that help:** Template Method, Strategy, Factory Method, State.

---

## I — Interface Segregation Principle (ISP)

**Rule:** Clients should not depend on methods they don't use.

**Violation → Fix:**
```python
# ❌ BEFORE: Fat interface forces empty implementations
class CloudProvider(ABC):
    @abstractmethod
    def create_server(self) -> None: ...
    @abstractmethod
    def create_cdn(self) -> None: ...        # Small providers don't have CDN
    @abstractmethod
    def create_storage(self) -> None: ...    # Small providers don't have storage

# ✅ AFTER: Segregated interfaces
class ComputeProvider(ABC):
    @abstractmethod
    def create_server(self) -> None: ...

class CDNProvider(ABC):
    @abstractmethod
    def create_cdn(self) -> None: ...

class SmallProvider(ComputeProvider):           # Only implements what it needs
    def create_server(self) -> None: print("Server created")

class FullProvider(ComputeProvider, CDNProvider):  # Implements both
    def create_server(self) -> None: print("Server created")
    def create_cdn(self) -> None: print("CDN created")
```

🐍 **Python note:** `Protocol` (PEP 544) enables structural subtyping (duck typing with type checking) — ideal for ISP without explicit inheritance.

**Violation signals:** Classes with `NotImplementedError` or `pass` in methods; interfaces with 7+ methods; changes in interface affect unrelated clients.

**Patterns that help:** Adapter, Facade, Proxy, Bridge.

---

## D — Dependency Inversion Principle (DIP)

**Rule:** High-level classes must not depend on low-level classes. Both depend on abstractions.

**Violation → Fix:**
```python
# ❌ BEFORE: Business logic depends on concrete infrastructure
class InformePresupuestario:
    def __init__(self):
        self.db = MySQLDatabase()  # Hard-coded concrete dependency

# ✅ AFTER: Both depend on abstraction
class BaseDeDatos(ABC):
    @abstractmethod
    def leer(self, query: str) -> list: ...

class InformePresupuestario:
    def __init__(self, db: BaseDeDatos):  # Depends on abstraction
        self.db = db
```

**Violation signals:** Constructors that instantiate concrete classes directly (`MySQLDatabase()`, `FileLogger()`); business modules importing infrastructure; can't test without real DB/network.

**Patterns that help:** Abstract Factory, Strategy, Bridge, Observer, Factory Method.
