---
name: refactoring
description: "Apply code refactoring techniques to improve code quality. Use this skill whenever the user asks to refactor code, review code for smells, improve code structure, reduce technical debt, or clean up messy code. Also trigger when the user mentions specific code smells (Long Method, Large Class, Feature Envy, etc.), refactoring techniques (Extract Method, Move Method, etc.), or asks 'how can I improve this code?', 'this code is hard to maintain', or 'what's wrong with this design?'. Covers 22 code smells, 66 refactoring techniques, and Python-specific adaptations. Do NOT trigger for purely algorithmic optimization, performance tuning, or UI/UX tasks."
---

# Code Refactoring Skill

Reference-grade knowledge base for code review, refactoring, and quality improvement.
Based on "Dive Into Refactoring" (Alexander Shvets / refactoring.guru) and "Refactoring" (Martin Fowler).

## Reference Files

Read the appropriate reference file based on the task:

| Task | Read this file |
|------|----------------|
| Identify what's wrong with code | `references/smell-catalog.md` — 22 smells with signals and treatments |
| Apply a specific refactoring | `references/technique-catalog.md` — 66 techniques with steps and examples |
| Map smell → fix | `references/smell-technique-matrix.md` — Complete cross-reference matrix |
| Adapt Java patterns to Python | `references/java-to-python.md` — Equivalences, idioms, native tools |

Read `smell-technique-matrix.md` first when performing a full code review — it provides the fastest path from diagnosis to treatment.

---

## Quick Reference: Refactoring Fundamentals

### When to Refactor

- **Rule of Three**: First time, just do it. Second time, wince. Third time, refactor.
- **Before adding a feature**: Clean the area first so the new code fits cleanly.
- **When fixing a bug**: Refactor the surroundings to prevent future bugs.
- **During code review**: Last chance before code enters the shared repository.
- **Alarm signals**: "Simple" changes taking days. New team members can't become productive. Same bug fix applied in multiple places.

### How to Refactor Safely

1. Ensure test coverage exists before touching anything. No tests → write tests first.
2. Make small, incremental changes. Commit after each successful step.
3. Never mix refactoring with new functionality in the same commit.
4. Run tests after every transformation.
5. If a step breaks tests, revert and try a smaller step.

### Technical Debt Model

Debt accumulates from: deadline pressure, missing tests, missing docs, late integration of parallel branches, lack of standards enforcement. Debt compounds — the cost of change grows exponentially with unmanaged debt.

---

## Smell Categories (Summary)

Use this to quickly classify a problem, then consult `references/smell-catalog.md` for full details.

### Bloaters — Code that has grown too large
- **Long Method** — Method > 10-15 lines, multiple indent levels, needs comments to explain sections
- **Large Class** — Class > 200 lines, generic name (Manager, Processor), multiple responsibilities
- **Primitive Obsession** — Domain concepts as `str`/`int`/`dict` instead of proper objects
- **Long Parameter List** — Method with > 3-4 parameters
- **Data Clumps** — Same group of fields/params repeated across methods/classes

### OO Abusers — Misuse of object-oriented principles
- **Switch Statements** — Complex `if/elif` chains based on type code, duplicated across methods
- **Temporary Field** — Fields that are `None` most of the time, only used in certain methods
- **Refused Bequest** — Subclass ignores or throws on inherited methods
- **Alternative Classes with Different Interfaces** — Similar classes with incompatible method signatures

### Change Preventers — Code that resists modification
- **Divergent Change** — One class modified for multiple unrelated reasons
- **Shotgun Surgery** — One logical change requires touching many classes
- **Parallel Inheritance Hierarchies** — Creating a subclass always requires a parallel subclass elsewhere

### Dispensables — Elements whose removal improves the code
- **Comments** — Comments explaining *what* code does (not *why*) signal unclear code
- **Duplicate Code** — Identical or near-identical blocks in multiple locations
- **Lazy Class** — Class that doesn't justify its existence
- **Data Class** — Class with only fields and getters/setters, no behavior
- **Dead Code** — Unreachable methods, unused variables, commented-out blocks
- **Speculative Generality** — Abstractions created "just in case" with no current use

### Couplers — Excessive inter-class dependencies
- **Feature Envy** — Method uses another object's data more than its own
- **Inappropriate Intimacy** — Two classes know too much about each other's internals
- **Message Chains** — `a.b().c().d()` — client navigates deep object graph
- **Middle Man** — Class that only delegates without adding value

### Other
- **Incomplete Library Class** — Library missing functionality you need

---

## Technique Families (Summary)

Use this to identify the right family, then consult `references/technique-catalog.md` for full procedures.

### Composing Methods (9 techniques)
Restructure methods: Extract Method, Inline Method, Extract Variable, Inline Temp, Replace Temp with Query, Split Temporary Variable, Remove Assignments to Parameters, Replace Method with Method Object, Substitute Algorithm.

### Moving Features between Objects (8 techniques)
Redistribute responsibilities: Move Method, Move Field, Extract Class, Inline Class, Hide Delegate, Remove Middle Man, Introduce Foreign Method, Introduce Local Extension.

### Organizing Data (15 techniques)
Improve data handling: Self Encapsulate Field, Replace Data Value with Object, Change Value to Reference, Change Reference to Value, Replace Array with Object, Duplicate Observed Data, Change Unidirectional/Bidirectional Association, Replace Magic Number with Constant, Encapsulate Field, Encapsulate Collection, Replace Type Code with Class/Subclasses/State-Strategy, Replace Subclass with Fields.

### Simplifying Conditional Expressions (8 techniques)
Tame conditionals: Decompose Conditional, Consolidate Conditional Expression, Consolidate Duplicate Conditional Fragments, Remove Control Flag, Replace Nested Conditional with Guard Clauses, Replace Conditional with Polymorphism, Introduce Null Object, Introduce Assertion.

### Simplifying Method Calls (14 techniques)
Clean interfaces: Rename Method, Add/Remove Parameter, Separate Query from Modifier, Parameterize Method, Replace Parameter with Explicit Methods, Preserve Whole Object, Replace Parameter with Method Call, Introduce Parameter Object, Remove Setting Method, Hide Method, Replace Constructor with Factory Method, Replace Error Code with Exception, Replace Exception with Test.

### Dealing with Generalization (12 techniques)
Manage inheritance: Pull Up/Push Down Field/Method, Pull Up Constructor Body, Extract Subclass/Superclass/Interface, Collapse Hierarchy, Form Template Method, Replace Inheritance with Delegation, Replace Delegation with Inheritance.

---

## Workflow for Code Review

When reviewing code for quality issues:

1. **Read** `references/smell-technique-matrix.md` to have the full mapping loaded.
2. **Scan** the code for smells using the signals from the smell catalog above.
3. **Diagnose** each smell and look up its treatments in the matrix.
4. **Prioritize**: Fix smells that block other fixes first (typically: Duplicate Code, Long Method, Large Class).
5. **Apply** techniques from `references/technique-catalog.md`, following the step-by-step procedures.
6. **Verify** tests pass after each transformation.

When the target language is Python, also consult `references/java-to-python.md` for idiomatic adaptations.
