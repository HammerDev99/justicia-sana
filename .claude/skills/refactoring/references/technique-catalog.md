# Refactoring Technique Catalog (66 Techniques)

Compressed reference for agent use. Each technique: steps, example (when impactful), relations.

## Table of Contents
- [Composing Methods](#1-composing-methods)
- [Moving Features between Objects](#2-moving-features-between-objects)
- [Organizing Data](#3-organizing-data)
- [Simplifying Conditional Expressions](#4-simplifying-conditional-expressions)
- [Simplifying Method Calls](#5-simplifying-method-calls)
- [Dealing with Generalization](#6-dealing-with-generalization)

---

## 1. Composing Methods

### 1.1 Extract Method
**Steps:** Create method with descriptive name → copy fragment → resolve local variables (params, return values) → replace fragment with call → test.

```python
# ❌ Before
def print_owing(self):
    # calculate outstanding
    outstanding = sum(o.amount for o in self.orders)
    # print details
    print(f"name: {self.name}")
    print(f"amount: {outstanding}")

# ✅ After
def print_owing(self):
    print_details(self.calculate_outstanding())

def calculate_outstanding(self):
    return sum(o.amount for o in self.orders)
```

**Fixes:** Long Method, Duplicate Code, Comments. **Opposes:** Inline Method.

---

### 1.2 Inline Method
**Steps:** Verify not polymorphic → replace all calls with body → delete method → test.

```python
# ❌ Before
def get_rating(self):
    return 2 if self.more_than_five_late() else 1
def more_than_five_late(self):
    return self.late_deliveries > 5

# ✅ After
def get_rating(self):
    return 2 if self.late_deliveries > 5 else 1
```

**Fixes:** Speculative Generality, Middle Man. **Opposes:** Extract Method.

---

### 1.3 Extract Variable
**Steps:** Insert named variable before expression → assign subexpression → replace in code → test.

```python
# ❌ Before
if platform.upper().find("MAC") > -1 and browser.upper().find("IE") > -1 and was_initialized() and resize > 0: ...

# ✅ After
is_mac = platform.upper().find("MAC") > -1
is_ie = browser.upper().find("IE") > -1
was_resized = resize > 0
if is_mac and is_ie and was_initialized() and was_resized: ...
```

**Fixes:** Comments (complex expressions). **Opposes:** Inline Temp.

---

### 1.4 Inline Temp
**Steps:** Verify single assignment → replace all reads with expression → delete variable → test.

```python
# Before: base_price = order.base_price(); return base_price > 1000
# After:  return order.base_price() > 1000
```

**Prepares:** Replace Temp with Query. **Opposes:** Extract Variable.

---

### 1.5 Replace Temp with Query
**Steps:** Verify single assignment → extract expression to method → replace temp with call → test.

```python
# ❌ Before
def calculate_total(self):
    base_price = self.quantity * self.item_price
    if base_price > 1000: return base_price * 0.95
    return base_price * 0.98

# ✅ After
@property
def base_price(self):
    return self.quantity * self.item_price

def calculate_total(self):
    if self.base_price > 1000: return self.base_price * 0.95
    return self.base_price * 0.98
```

🐍 Python: `@property` is ideal for this pattern.

**Fixes:** Long Method. **Avoid when:** Expression is computationally expensive and called many times (use `@lru_cache`).

---

### 1.6 Split Temporary Variable
**Steps:** Rename at first assignment with purpose-describing name → use new name until next assignment → repeat per reassignment → test.

```python
# ❌ Before
temp = 2 * (height + width)  # perimeter
print(temp)
temp = height * width  # area
print(temp)

# ✅ After
perimeter = 2 * (height + width)
print(perimeter)
area = height * width
print(area)
```

**Prepares:** Extract Method, Replace Temp with Query.

---

### 1.7 Remove Assignments to Parameters
**Steps:** Create local variable with param value → replace post-assignment refs with local → test.

```python
# ❌ Before
def discount(input_val, quantity):
    if quantity > 50: input_val -= 2
    return input_val

# ✅ After
def discount(input_val, quantity):
    result = input_val
    if quantity > 50: result -= 2
    return result
```

🐍 Python: Reassigning immutable params doesn't affect caller, but confuses readers. Mutating mutable params (`list`, `dict`) DOES affect caller — even more dangerous.

---

### 1.8 Replace Method with Method Object
**Steps:** Create class named after method → fields for each local var and param → constructor accepting params → copy body to `compute()` → replace original with `ClassName(params).compute()` → now Extract Method freely inside new class → test.

```python
# ❌ Before — entangled local vars prevent extraction
class Order:
    def price(self):
        primary = ...; secondary = ...; tertiary = ...
        # complex interplay between all three

# ✅ After
class PriceCalculator:
    def __init__(self, order):
        self.order = order
    def compute(self):
        self.primary = ...
        return self._apply_discounts()
    def _apply_discounts(self): ...

class Order:
    def price(self): return PriceCalculator(self).compute()
```

**Fixes:** Long Method (when Extract Method alone isn't viable).

---

### 1.9 Substitute Algorithm
**Steps:** Ensure test coverage → write new algorithm → run tests, compare results → delete old → test.

```python
# ❌ Before
def found_person(people):
    for p in people:
        if p == "Don": return "Don"
        if p == "John": return "John"
        if p == "Kent": return "Kent"
    return ""

# ✅ After
def found_person(people):
    return next((p for p in people if p in {"Don", "John", "Kent"}), "")
```

**Fixes:** Duplicate Code, Long Method.

---

## 2. Moving Features between Objects

### 2.1 Move Method
**Steps:** Verify all elements used → check inheritance chain → create method in target → copy body, adjust refs → convert original to delegation or delete → test.

```python
# ❌ Before — Account knows too much about type logic
class Account:
    def overdraft_charge(self):
        if self.type.is_premium():
            result = 10 + max(0, (self.days_overdrawn - 7) * 0.85)
            return result
        return self.days_overdrawn * 1.75

# ✅ After — logic moves to AccountType
class AccountType:
    def overdraft_charge(self, days_overdrawn):
        if self.is_premium():
            return 10 + max(0, (days_overdrawn - 7) * 0.85)
        return days_overdrawn * 1.75
```

**Fixes:** Feature Envy, Shotgun Surgery, Inappropriate Intimacy.

---

### 2.2 Move Field
**Steps:** Encapsulate if public → create field + accessors in target → redirect all refs → delete original → test.

**Fixes:** Feature Envy, Shotgun Surgery.

---

### 2.3 Extract Class
**Steps:** Decide responsibility split → create new class → add composition link → Move Field/Method iteratively → minimize interfaces → test.

```python
# ❌ Before
class Person:
    def __init__(self, name, area_code, number):
        self.name = name
        self.office_area_code = area_code
        self.office_number = number

# ✅ After
@dataclass
class TelephoneNumber:
    area_code: str
    number: str
    def __str__(self): return f"({self.area_code}) {self.number}"

class Person:
    def __init__(self, name, area_code, number):
        self.name = name
        self.telephone = TelephoneNumber(area_code, number)
```

**Fixes:** Large Class, Divergent Change, Data Clumps, Primitive Obsession.

---

### 2.4 Inline Class
**Steps:** Move all features from source to target → update refs → delete empty class → test.

**Fixes:** Lazy Class, Speculative Generality, Middle Man. **Opposes:** Extract Class.

---

### 2.5 Hide Delegate
**Steps:** For each delegate method client uses, create wrapper in server class → update client calls → remove delegate accessor if unused → test.

```python
# ❌ Before: manager = employee.department.manager
# ✅ After:
class Employee:
    @property
    def manager(self): return self.department.manager
# Client: manager = employee.manager
```

**Fixes:** Message Chains, Inappropriate Intimacy. **Opposes:** Remove Middle Man.

---

### 2.6 Remove Middle Man
**Steps:** Create accessor for delegate → replace delegating calls with direct delegate access → remove delegating methods → test.

**Fixes:** Middle Man. **Opposes:** Hide Delegate.

---

### 2.7 Introduce Foreign Method
**Steps:** Create utility function in client (or utils module) → pass library instance as param → document as foreign method → test.

```python
# Foreign method for datetime
def next_day(d: datetime) -> datetime:
    """Foreign method — should be in datetime."""
    return d + timedelta(days=1)
```

🐍 Python: Free functions in a utils module are idiomatic.

**Fixes:** Incomplete Library Class.

---

### 2.8 Introduce Local Extension
**Steps:** Create subclass or wrapper of library class → add constructor accepting original → add new methods → replace usages where new methods needed → test.

🐍 Python: Subclass or use `__getattr__` for transparent wrapper. Avoid monkey patching in production.

**Fixes:** Incomplete Library Class (when multiple foreign methods are needed).

---

## 3. Organizing Data

### 3.1 Self Encapsulate Field
**Steps:** Create getter/setter → replace internal direct access with getter/setter → test.

🐍 Python: `@property` enables this transparently.

**Prepares:** Replace Data Value with Object, Replace Type Code with Class.

---

### 3.2 Replace Data Value with Object
**Steps:** Create class for value → change field type to new class → move related behavior → test.

```python
# Before: self.customer = "John"  (str)
# After:  self.customer = Customer("John")  (object with behavior)
```

**Fixes:** Primitive Obsession, Data Clumps.

---

### 3.3 Change Value to Reference
**Steps:** Create registry/factory → replace direct creation with registry lookup → ensure single instance per identity → test.

**Use when:** Changes to one instance must reflect everywhere. **Opposes:** Change Reference to Value.

---

### 3.4 Change Reference to Value
**Steps:** Make object immutable → implement `__eq__`/`__hash__` → remove registry if unused → test.

🐍 Python: `@dataclass(frozen=True)` auto-generates `__eq__` and `__hash__`.

**Opposes:** Change Value to Reference.

---

### 3.5 Replace Array with Object
**Steps:** Create class/dataclass with named fields → replace array usage → test.

```python
# Before: row = ["Liverpool", 15, 3]
# After:
@dataclass
class TeamRecord:
    name: str; wins: int; losses: int
```

🐍 Python: `NamedTuple` or `@dataclass`.

**Fixes:** Primitive Obsession.

---

### 3.6 Duplicate Observed Data
**Steps:** Create domain object → establish sync (Observer) between GUI and domain → move logic to domain → test.

**Fixes:** Large Class (GUI + domain mix).

---

### 3.7 Change Unidirectional to Bidirectional
**Steps:** Add back-reference field → add methods to maintain consistency → test.

**Use only when:** Genuine need for reverse navigation. Bidirectional = more complexity. **Opposes:** 3.8.

---

### 3.8 Change Bidirectional to Unidirectional
**Steps:** Find which side can drop the reference → remove it → provide alternative access if needed → test.

**Fixes:** Inappropriate Intimacy. **Opposes:** 3.7.

---

### 3.9 Replace Magic Number with Symbolic Constant
**Steps:** Declare constant with meaningful name → replace literals → test.

```python
# Before: return mass * 9.81 * height
GRAVITATIONAL_ACCELERATION = 9.81  # m/s²
# After: return mass * GRAVITATIONAL_ACCELERATION * height
```

🐍 Python: `UPPER_SNAKE_CASE` convention. For grouped constants, use `enum.Enum`.

---

### 3.10 Encapsulate Field
**Steps:** Make field private → add getter/setter → update external access → test.

🐍 Python: `_prefix` convention + `@property`.

**Fixes:** Data Class.

---

### 3.11 Encapsulate Collection
**Steps:** Return copy/view instead of direct collection → add add/remove methods → test.

```python
# ✅ After
class Course:
    def __init__(self): self._students = []
    @property
    def students(self): return tuple(self._students)
    def add_student(self, s): self._students.append(s)
    def remove_student(self, s): self._students.remove(s)
```

**Fixes:** Data Class, Inappropriate Intimacy.

---

### 3.12 Replace Type Code with Class
**Steps:** Create Enum/class for type → change field type → update all references → test.

```python
# Before: BLOOD_A = 0; BLOOD_B = 1
# After:
class BloodType(Enum):
    A = 0; B = 1; AB = 2; O = 3
```

🐍 Python: `enum.Enum` is the native solution.

**Fixes:** Primitive Obsession. **Prepares:** Replace Type Code with Subclasses.

---

### 3.13 Replace Type Code with Subclasses
**Steps:** Self-encapsulate type field → create subclass per value → factory method returning correct subclass → move conditional behavior to subclasses → delete type field → test.

**Fixes:** Switch Statements, Primitive Obsession. **Prepares:** Replace Conditional with Polymorphism.

---

### 3.14 Replace Type Code with State/Strategy
**Steps:** Create State/Strategy interface → create class per type value → replace type field with state object → delegate behavior to state → test.

**Use when:** Type changes at runtime OR class already has inheritance.

```python
class ShippingStrategy(ABC):
    @abstractmethod
    def cost(self, weight: float) -> float: ...

class GroundShipping(ShippingStrategy):
    def cost(self, weight): return weight * 1.5

class Order:
    def __init__(self, weight, strategy: ShippingStrategy):
        self.weight = weight
        self.shipping = strategy  # swappable at runtime
    def shipping_cost(self): return self.shipping.cost(self.weight)
```

**Alternative to:** Replace Type Code with Subclasses (when type is dynamic).

---

### 3.15 Replace Subclass with Fields
**Steps:** Replace constant-returning methods with fields in parent → set in constructor → delete subclasses → test.

**Fixes:** Lazy Class (trivial subclasses). **Opposes:** Replace Type Code with Subclasses.

---

## 4. Simplifying Conditional Expressions

### 4.1 Decompose Conditional
**Steps:** Extract condition → Extract then-branch → Extract else-branch → name all three → test.

```python
# Before: if date < SUMMER_START or date > SUMMER_END: charge = qty * winter_rate + svc_charge
# After:  charge = summer_charge(qty) if is_summer(date) else winter_charge(qty)
```

**Fixes:** Long Method. **Uses:** Extract Method.

---

### 4.2 Consolidate Conditional Expression
**Steps:** Combine conditions with same result into single expression → extract to named method → test.

```python
# ❌ Before
if self.seniority < 2: return 0
if self.months_disabled > 12: return 0
if self.is_part_time: return 0

# ✅ After
if self.is_not_eligible(): return 0

def is_not_eligible(self):
    return self.seniority < 2 or self.months_disabled > 12 or self.is_part_time
```

**Fixes:** Duplicate Code (in conditionals).

---

### 4.3 Consolidate Duplicate Conditional Fragments
**Steps:** Identify code common to all branches → move outside conditional → test.

```python
# Before: both branches call send_notification()
# After: conditional sets only the varying part, send_notification() called once after
```

---

### 4.4 Remove Control Flag
**Steps:** Replace flag variable with `break`, `continue`, or `return` → test.

🐍 Python: Prefer `break`/`return` and `for/else` over boolean flags.

---

### 4.5 Replace Nested Conditional with Guard Clauses
**Steps:** Identify special cases → convert to early returns (guard clauses) → leave normal flow at the end → test.

```python
# ❌ Before — deep nesting
def get_payment(self):
    if self.is_dead:
        result = dead_amount()
    else:
        if self.is_separated:
            result = separated_amount()
        else:
            if self.is_retired:
                result = retired_amount()
            else:
                result = normal_amount()
    return result

# ✅ After — flat guards
def get_payment(self):
    if self.is_dead: return dead_amount()
    if self.is_separated: return separated_amount()
    if self.is_retired: return retired_amount()
    return normal_amount()
```

**Fixes:** Long Method (deep nesting).

---

### 4.6 Replace Conditional with Polymorphism
**Steps:** Create class hierarchy or use existing → move each branch to overridden method in corresponding subclass → delete conditional → test.

**Fixes:** Switch Statements. **Uses:** Replace Type Code with Subclasses, Extract Subclass.

---

### 4.7 Introduce Null Object
**Steps:** Create NullX class implementing same interface with default behavior → replace null checks with NullX instance → test.

```python
class NullCustomer:
    def get_plan(self): return BillingPlan.basic()
    def __bool__(self): return False
# Client code: plan = customer.get_plan()  # works for real or null customer
```

🐍 Python: Less common than in Java. Consider default params or `customer or NullCustomer()`.

**Fixes:** Switch Statements (null checks), Temporary Field.

---

### 4.8 Introduce Assertion
**Steps:** Identify implicit assumptions → add `assert` with descriptive message → test.

```python
def get_expense_limit(self):
    assert self.expense_limit != NULL or self.primary_project is not None, \
        "Must have expense limit or primary project"
    ...
```

**Fixes:** Comments (that describe preconditions).

---

## 5. Simplifying Method Calls

### 5.1 Rename Method
**Steps:** Create method with new name → copy body → update all callers → delete old method → test.

Test: Can you understand the method without reading its body?

**Fixes:** Comments, Alternative Classes with Different Interfaces.

---

### 5.2 Add Parameter
**Steps:** Add parameter with default → update callers → test.

⚠️ Consider first: can the method obtain the info itself? Could cause Long Parameter List.

---

### 5.3 Remove Parameter
**Steps:** Verify unused in all overrides → remove from signature → update callers → test.

**Fixes:** Speculative Generality. **Opposes:** Add Parameter.

---

### 5.4 Separate Query from Modifier
**Steps:** Create pure query (no side effects) → create pure command (no return) → replace original calls with query + command → test.

```python
# Before: def get_total_and_send_bill(self) → does both
# After:
def get_total(self): ...  # query — no side effects
def send_bill(self): ...  # command — modifies state
```

Principle: **CQS** — a method should be a command OR a query, never both.

---

### 5.5 Parameterize Method
**Steps:** Create single method with parameter for varying value → replace specialized methods → test.

```python
# Before: five_percent_raise(), ten_percent_raise()
# After:  raise_salary(percentage)
```

**Fixes:** Duplicate Code. **Opposes:** Replace Parameter with Explicit Methods.

---

### 5.6 Replace Parameter with Explicit Methods
**Steps:** Create method per parameter value → replace calls → delete parameterized method → test.

```python
# Before: set_value("height", 10)
# After:  set_height(10)
```

**Use when:** Discrete, small set of possible values. **Opposes:** Parameterize Method.

---

### 5.7 Preserve Whole Object
**Steps:** Replace extracted values with whole source object → adjust method signature → test.

```python
# Before: plan.within_range(days.low, days.high)
# After:  plan.within_range(days)
```

**Avoid when:** Passing whole object creates unwanted dependency.

**Fixes:** Long Parameter List, Data Clumps.

---

### 5.8 Replace Parameter with Method Call
**Steps:** Caller calculates value, but method can get it itself → remove param → method calls source directly → test.

**Fixes:** Long Parameter List.

---

### 5.9 Introduce Parameter Object
**Steps:** Create class grouping related params → replace param groups with new object → move behavior to new class if appropriate → test.

```python
# Before: amount_invoiced(start_date, end_date)
# After:
@dataclass(frozen=True)
class DateRange:
    start: date; end: date
    def contains(self, d): return self.start <= d <= self.end

def amount_invoiced(self, period: DateRange): ...
```

📌 The Parameter Object often attracts behavior and becomes a domain class.

**Fixes:** Long Parameter List, Data Clumps, Primitive Obsession.

---

### 5.10 Remove Setting Method
**Steps:** Remove setter → set field only in constructor → test.

🐍 Python: `@dataclass(frozen=True)` or `@property` without setter.

**Fixes:** Data Class.

---

### 5.11 Hide Method
**Steps:** Make method private/protected → test.

🐍 Python: `_prefix` convention, `__name_mangling` (rare).

---

### 5.12 Replace Constructor with Factory Method
**Steps:** Create `@classmethod` factory → move creation logic there → replace `__init__` calls where logic is needed → test.

```python
class Employee:
    @classmethod
    def create(cls, type_code):
        if type_code == "engineer": return Engineer()
        elif type_code == "manager": return Manager()
        raise ValueError(f"Unknown type: {type_code}")
```

🐍 Python: `@classmethod` is the idiomatic factory pattern.

---

### 5.13 Replace Error Code with Exception
**Steps:** Replace special return values (-1, None, False) with `raise` → update callers → test.

```python
# Before: if amount > balance: return -1
# After:  if amount > balance: raise InsufficientFundsError(...)
```

**Opposes:** Replace Exception with Test.

---

### 5.14 Replace Exception with Test
**Steps:** Replace try/except with pre-check conditional → test.

```python
# Before: try: return self.values[i] / except IndexError: return 0
# After:  return self.values[i] if 0 <= i < len(self.values) else 0
```

🐍 Python: EAFP style (`try/except`) is idiomatic, but for clearly predictable conditions, a check can be clearer.

**Opposes:** Replace Error Code with Exception.

---

## 6. Dealing with Generalization

### 6.1 Pull Up Field
**Steps:** Verify identical usage in subclasses → move to superclass → delete from subclasses → test.

**Fixes:** Duplicate Code.

---

### 6.2 Pull Up Method
**Steps:** Verify identical behavior → unify signatures if needed (Rename Method) → move to superclass → delete from subclasses → test.

**Fixes:** Duplicate Code.

---

### 6.3 Pull Up Constructor Body
**Steps:** Create superclass constructor with common code → call `super().__init__()` from subclasses → test.

```python
class Employee:
    def __init__(self, name, id): self.name = name; self.id = id

class Manager(Employee):
    def __init__(self, name, id, grade):
        super().__init__(name, id)
        self.grade = grade
```

---

### 6.4 Push Down Method
**Steps:** Move method from superclass to relevant subclasses only → test.

**Opposes:** Pull Up Method.

---

### 6.5 Push Down Field
**Steps:** Move field from superclass to relevant subclasses only → test.

**Opposes:** Pull Up Field.

---

### 6.6 Extract Subclass
**Steps:** Create subclass → Push Down Method/Field for variant-specific features → replace conditional code with polymorphism → test.

**Fixes:** Large Class, Switch Statements. **Alternative to:** Extract Class (when hierarchy fits).

---

### 6.7 Extract Superclass
**Steps:** Create abstract superclass → Pull Up common fields/methods → verify subclasses use inherited elements → test.

**Fixes:** Duplicate Code, Refused Bequest, Alternative Classes with Different Interfaces.

---

### 6.8 Extract Interface
**Steps:** Identify shared method subset → create interface/protocol → make classes conform → test.

🐍 Python: `typing.Protocol` (structural subtyping) or `abc.ABC` (nominal subtyping).

```python
from typing import Protocol

class Billable(Protocol):
    def get_rate(self) -> float: ...
    def has_special_skill(self) -> bool: ...

# Any class with get_rate() and has_special_skill() satisfies Billable
# No explicit inheritance needed (structural subtyping)
```

**Fixes:** Alternative Classes with Different Interfaces.

---

### 6.9 Collapse Hierarchy
**Steps:** Choose which class to keep → Pull Up or Push Down everything → delete empty class → update refs → test.

**Fixes:** Lazy Class, Speculative Generality.

---

### 6.10 Form Template Method
**Steps:** Identify similar method structure in subclasses → extract varying steps as abstract methods → pull shared skeleton to superclass → test.

```python
class DataMiner(ABC):
    def mine(self, path):  # template method
        file = self.open_file(path)
        raw = self.extract_data(file)
        analysis = self.parse_data(raw)
        self.send_report(analysis)
    @abstractmethod
    def open_file(self, path): ...
    @abstractmethod
    def extract_data(self, file): ...
    @abstractmethod
    def parse_data(self, raw): ...
```

**Fixes:** Duplicate Code (similar structure in subclasses).

---

### 6.11 Replace Inheritance with Delegation
**Steps:** Create field of former parent type → delegate needed methods → remove `extends`/inheritance → test.

```python
# ❌ Before — Stack IS NOT a list
class Stack(list):
    def push(self, item): self.append(item)
    # inherits sort(), reverse(), __getitem__... nonsensical for Stack

# ✅ After — Stack USES a list
class Stack:
    def __init__(self): self._items = []
    def push(self, item): self._items.append(item)
    def pop(self): return self._items.pop()
    def peek(self): return self._items[-1]
    def is_empty(self): return len(self._items) == 0
```

**Fixes:** Refused Bequest. **Opposes:** Replace Delegation with Inheritance.

---

### 6.12 Replace Delegation with Inheritance
**Steps:** Make delegating class inherit from delegate → remove delegation field and passthrough methods → test.

**Use when:** Too many passthrough methods AND "is-a" holds. **Avoid when:** Delegate is shared or only partially used.

**Fixes:** Middle Man. **Opposes:** Replace Inheritance with Delegation.
