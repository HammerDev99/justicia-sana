# Code Smell Catalog (22 Smells)

Compressed reference for agent use. Each smell: signals for detection, treatments with technique references, and one example where visually impactful.

## Table of Contents
- [Bloaters](#bloaters)
- [OO Abusers](#oo-abusers)
- [Change Preventers](#change-preventers)
- [Dispensables](#dispensables)
- [Couplers](#couplers)
- [Other](#other)

---

## Bloaters

### Long Method
**Signals:** Method > 10-15 lines. Needs scroll. Internal comments explaining sections. Multiple indent levels. Generic name (`process()`, `handle()`). Variables used only in one section.

**Treatment:** Extract Method → break into named submethods. Replace Temp with Query → eliminate temps. Decompose Conditional → extract condition logic. Introduce Parameter Object → reduce params. Replace Method with Method Object → when local vars prevent extraction.

**Example:**
```python
# ❌ Before
def print_invoice(invoice):
    subtotal = 0
    for item in invoice.items:
        subtotal += item.quantity * item.price
    tax = subtotal * 0.19
    total = subtotal + tax
    header = f"FACTURA #{invoice.number}\nCliente: {invoice.client.name}\n"
    # ... 30 more lines of formatting and printing

# ✅ After
def print_invoice(invoice):
    totals = calculate_totals(invoice)
    print(format_header(invoice))
    print(format_line_items(invoice.items))
    print(format_footer(totals))
```

---

### Large Class
**Signals:** Class > 200 lines (Python). Generic name (Manager, Processor, Handler, Utility). Multiple unrelated responsibilities. Subsets of fields always used together. Many fields unused by most methods.

**Treatment:** Extract Class → split by responsibility. Extract Subclass → split by variant. Extract Interface → define contracts. Duplicate Observed Data → separate domain from GUI.

---

### Primitive Obsession
**Signals:** Strings/ints as type codes (`"admin"`, `1`). Repeated validation of same primitive. Fields always traveling together (`street`, `city`, `zip`). Params named `_str`, `_cents`, `_code`.

**Treatment:** Replace Data Value with Object → wrap primitive in domain class. Replace Type Code with Class/Subclasses/State-Strategy → behavior based on type. Replace Array with Object → named fields. Introduce Parameter Object, Extract Class.

**Example:**
```python
# ❌ Before
def apply_discount(price: float, currency: str, discount_pct: float) -> float: ...

# ✅ After
@dataclass(frozen=True)
class Money:
    amount: float
    currency: str
    def apply_discount(self, pct: float) -> "Money": ...
```

🐍 Python: `@dataclass(frozen=True)`, `NamedTuple`, `enum.Enum` are native tools for replacing primitives.

---

### Long Parameter List
**Signals:** > 3-4 params. Several consecutive params of same type (easy to swap). Boolean flags altering behavior. Param groups that always travel together.

**Treatment:** Replace Parameter with Method Call → method obtains value itself. Preserve Whole Object → pass the source object. Introduce Parameter Object → group params into class.

---

### Data Clumps
**Signals:** Same 3-4 fields in multiple classes. Same param combos in multiple method signatures. Removing one item from the group makes the rest meaningless (e.g., `start_date`, `end_date` → `DateRange`).

**Treatment:** Extract Class → create the missing abstraction. Introduce Parameter Object. Preserve Whole Object.

---

## OO Abusers

### Switch Statements
**Signals:** Long `if/elif/else` or `match/case` based on type attribute. Same conditional pattern duplicated across methods. Adding a new type requires modifying multiple conditionals.

**Treatment:** Replace Conditional with Polymorphism. Replace Type Code with Subclasses. Replace Type Code with State/Strategy → when type changes at runtime. Replace Parameter with Explicit Methods. Introduce Null Object → for null-check chains.

**Example:**
```python
# ❌ Before
def calculate_pay(self):
    if self.type_code == "engineer": return self.base * 1.2
    elif self.type_code == "manager": return self.base * 1.5 + 500
    elif self.type_code == "intern": return self.base * 0.8

# ✅ After — polymorphism
class Engineer(Employee):
    def calculate_pay(self): return self.base * 1.2
class Manager(Employee):
    def calculate_pay(self): return self.base * 1.5 + 500
```

🐍 Python: Also consider dict-dispatch: `strategies = {"engineer": lambda s: s * 1.2, ...}`

---

### Temporary Field
**Signals:** Fields initialized as `None`, only populated in certain methods. Conditionals checking if a field "exists" before use. Algorithm stores intermediate results in instance fields instead of local vars.

**Treatment:** Extract Class → move field and its logic to dedicated class. Introduce Null Object. Replace Method with Method Object.

---

### Refused Bequest
**Signals:** Inherited methods left empty or overridden to raise `NotImplementedError`. Subclass uses small fraction of parent's interface. "is-a" relationship doesn't hold semantically.

**Treatment:** Replace Inheritance with Delegation → use composition instead. Extract Superclass → restructure hierarchy.

---

### Alternative Classes with Different Interfaces
**Signals:** Two classes doing similar things with different method names/signatures. Client code has conditionals choosing which interface to use.

**Treatment:** Rename Method → unify signatures. Move Method. Add Parameter. Extract Superclass/Interface → define shared contract.

---

## Change Preventers

### Divergent Change
**Signals:** "Every time X changes, I modify this class. Every time Y changes, I also modify this class." — class changes for multiple unrelated reasons. Violates SRP.

**Treatment:** Extract Class → one class per reason to change. Extract Superclass/Subclass.

---

### Shotgun Surgery
**Signals:** One conceptual change → many small edits across many files. Easy to miss one of the change points. Developers need checklists for single logical changes. Opposite of Divergent Change.

**Treatment:** Move Method + Move Field → consolidate the scattered responsibility. Inline Class → merge fragments.

---

### Parallel Inheritance Hierarchies
**Signals:** Creating subclass of A always requires creating subclass of B. Class prefixes in both hierarchies match. Special case of Shotgun Surgery.

**Treatment:** Move Method + Move Field → collapse one hierarchy as delegate of the other.

---

## Dispensables

### Comments (Excessive)
**Signals:** Comments explaining *what* code does (not *why*). Outdated comments contradicting code. Commented-out code blocks "just in case."

**Treatment:** Extract Method → name replaces comment. Extract Variable → name explains expression. Rename Method → name reveals intent. Introduce Assertion → formalize preconditions.

📌 Legitimate comments: *Why* decisions, TODOs with context, public API docstrings, non-obvious consequence warnings.

---

### Duplicate Code
**Signals:** Identical blocks in different methods/classes. Similar logic with small variations across copies. Bug fixes applied in multiple places.

**Treatment:** Extract Method → same class. Pull Up Method → sibling subclasses. Extract Superclass → unrelated classes. Form Template Method → similar but not identical structure. Substitute Algorithm → replace with cleaner version.

---

### Lazy Class
**Signals:** Class with 1-2 trivial methods. Created for future growth that never came. Left empty after prior refactoring moved everything out.

**Treatment:** Inline Class → absorb into another. Collapse Hierarchy → merge with parent/child.

---

### Data Class
**Signals:** Only fields + getters/setters, no behavior. Other classes extensively access and manipulate its data. No self-validation.

**Treatment:** Encapsulate Field + Encapsulate Collection → control access. Move Method → bring behavior to the data. Remove Setting Method → enforce immutability where appropriate.

🐍 Python: `@dataclass` is fine IF it also has behavior. A `@dataclass` with all logic in external functions is this smell.

---

### Dead Code
**Signals:** Methods nobody calls. Variables assigned but never read. Conditions that never evaluate to true. Unused imports. Commented-out code.

**Treatment:** Delete it. Git preserves history.

🐍 Python: `vulture` detects dead code. `ruff` catches unused imports and unread variables.

---

### Speculative Generality
**Signals:** Abstract class with single implementation. Methods with params always receiving the same value. Unused utility methods. "Just in case" abstractions.

**Treatment:** Collapse Hierarchy. Inline Class. Inline Method. Remove Parameter.

📌 YAGNI: Don't build for a future that doesn't exist yet.

---

## Couplers

### Feature Envy
**Signals:** Method uses multiple getters/properties of another object. More references to another object than to `self`.

**Treatment:** Move Method → relocate to the envied class. Extract Method → if only part of the method has envy.

---

### Inappropriate Intimacy
**Signals:** Class accesses another's internal attributes (bypassing public interface). Changing one class's internals breaks the other. Circular imports / mutual dependencies.

**Treatment:** Move Method/Field → redistribute. Extract Class → introduce intermediary. Hide Delegate. Replace Inheritance with Delegation. Change Bidirectional to Unidirectional.

---

### Message Chains
**Signals:** Multi-dot expressions: `obj.field.method().result.value`. Client knows internal structure of entire object chain.

**Treatment:** Hide Delegate → add convenience method. Extract Method + Move Method.

🐍 Python: Django querysets and Pandas chaining are idiomatic exceptions — evaluate case by case.

---

### Middle Man
**Signals:** Most methods are one-liners delegating to another object. Class has no significant logic of its own.

**Treatment:** Remove Middle Man → let client call delegate directly. Inline Method. Replace Delegation with Inheritance → if "is-a" relationship holds.

---

## Other

### Incomplete Library Class
**Signals:** Need a method on a class you can't modify (third-party library). Writing utility functions that operate on library objects.

**Treatment:** Introduce Foreign Method → utility function taking library object as param. Introduce Local Extension → subclass or wrapper for multiple additions.

🐍 Python: Free functions in a `_utils.py` module are idiomatic. Avoid monkey patching in production.
