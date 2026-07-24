# Smell → Technique Cross-Reference Matrix

Complete mapping of every code smell to the refactoring techniques that resolve it.
This is the primary lookup table for automated code review.

## Table of Contents
- [Bloaters](#bloaters)
- [OO Abusers](#oo-abusers)
- [Change Preventers](#change-preventers)
- [Dispensables](#dispensables)
- [Couplers](#couplers)
- [Other](#other)
- [Reverse Index: Technique → Smells](#reverse-index-technique--smells)

---

## Bloaters

| Smell | Primary Techniques | Secondary Techniques |
|-------|-------------------|---------------------|
| **Long Method** | Extract Method, Decompose Conditional | Replace Temp with Query, Introduce Parameter Object, Preserve Whole Object, Replace Method with Method Object |
| **Large Class** | Extract Class, Extract Subclass | Extract Interface, Duplicate Observed Data |
| **Primitive Obsession** | Replace Data Value with Object, Replace Type Code with Class | Replace Type Code with Subclasses, Replace Type Code with State/Strategy, Replace Array with Object, Introduce Parameter Object, Extract Class |
| **Long Parameter List** | Introduce Parameter Object, Preserve Whole Object | Replace Parameter with Method Call |
| **Data Clumps** | Extract Class, Introduce Parameter Object | Preserve Whole Object |

## OO Abusers

| Smell | Primary Techniques | Secondary Techniques |
|-------|-------------------|---------------------|
| **Switch Statements** | Replace Conditional with Polymorphism, Replace Type Code with Subclasses | Replace Type Code with State/Strategy, Replace Parameter with Explicit Methods, Introduce Null Object |
| **Temporary Field** | Extract Class, Replace Method with Method Object | Introduce Null Object |
| **Refused Bequest** | Replace Inheritance with Delegation | Extract Superclass |
| **Alternative Classes with Different Interfaces** | Rename Method, Extract Superclass | Move Method, Add Parameter, Extract Interface |

## Change Preventers

| Smell | Primary Techniques | Secondary Techniques |
|-------|-------------------|---------------------|
| **Divergent Change** | Extract Class | Extract Superclass, Extract Subclass |
| **Shotgun Surgery** | Move Method, Move Field | Inline Class |
| **Parallel Inheritance Hierarchies** | Move Method, Move Field | — |

## Dispensables

| Smell | Primary Techniques | Secondary Techniques |
|-------|-------------------|---------------------|
| **Comments** | Extract Method, Extract Variable | Rename Method, Introduce Assertion |
| **Duplicate Code** | Extract Method, Pull Up Method | Extract Superclass, Form Template Method, Substitute Algorithm |
| **Lazy Class** | Inline Class, Collapse Hierarchy | — |
| **Data Class** | Encapsulate Field, Move Method | Encapsulate Collection, Extract Method, Remove Setting Method |
| **Dead Code** | Delete it (VCS preserves history) | — |
| **Speculative Generality** | Collapse Hierarchy, Inline Class | Inline Method, Remove Parameter |

## Couplers

| Smell | Primary Techniques | Secondary Techniques |
|-------|-------------------|---------------------|
| **Feature Envy** | Move Method | Extract Method |
| **Inappropriate Intimacy** | Move Method, Move Field, Extract Class | Hide Delegate, Replace Inheritance with Delegation, Change Bidirectional to Unidirectional |
| **Message Chains** | Hide Delegate | Extract Method, Move Method |
| **Middle Man** | Remove Middle Man | Inline Method, Replace Delegation with Inheritance |

## Other

| Smell | Primary Techniques | Secondary Techniques |
|-------|-------------------|---------------------|
| **Incomplete Library Class** | Introduce Foreign Method | Introduce Local Extension |

---

## Reverse Index: Technique → Smells

This index maps each technique to the smells it treats. Use this when you know the technique and want to verify it's appropriate.

| Technique | Treats these smells |
|-----------|-------------------|
| **Extract Method** | Long Method, Duplicate Code, Comments, Feature Envy, Message Chains, Data Class |
| **Inline Method** | Middle Man, Speculative Generality |
| **Extract Variable** | Comments |
| **Replace Temp with Query** | Long Method |
| **Replace Method with Method Object** | Long Method, Temporary Field |
| **Substitute Algorithm** | Duplicate Code |
| **Decompose Conditional** | Long Method |
| **Move Method** | Feature Envy, Shotgun Surgery, Divergent Change, Inappropriate Intimacy, Parallel Inheritance Hierarchies, Alternative Classes with Different Interfaces, Message Chains |
| **Move Field** | Shotgun Surgery, Inappropriate Intimacy, Parallel Inheritance Hierarchies |
| **Extract Class** | Large Class, Primitive Obsession, Data Clumps, Divergent Change, Temporary Field, Inappropriate Intimacy |
| **Inline Class** | Lazy Class, Shotgun Surgery, Speculative Generality, Middle Man |
| **Hide Delegate** | Message Chains, Inappropriate Intimacy |
| **Remove Middle Man** | Middle Man |
| **Introduce Foreign Method** | Incomplete Library Class |
| **Introduce Local Extension** | Incomplete Library Class |
| **Replace Data Value with Object** | Primitive Obsession |
| **Replace Array with Object** | Primitive Obsession |
| **Replace Magic Number with Constant** | Primitive Obsession |
| **Encapsulate Field** | Data Class |
| **Encapsulate Collection** | Data Class |
| **Replace Type Code with Class** | Primitive Obsession |
| **Replace Type Code with Subclasses** | Primitive Obsession, Switch Statements |
| **Replace Type Code with State/Strategy** | Primitive Obsession, Switch Statements |
| **Replace Subclass with Fields** | Lazy Class (trivial subclasses) |
| **Consolidate Conditional Expression** | Duplicate Code (in conditionals) |
| **Consolidate Duplicate Conditional Fragments** | Duplicate Code |
| **Remove Control Flag** | Long Method |
| **Replace Nested Conditional with Guard Clauses** | Long Method |
| **Replace Conditional with Polymorphism** | Switch Statements, Long Method |
| **Introduce Null Object** | Switch Statements (null checks), Temporary Field |
| **Introduce Assertion** | Comments (preconditions) |
| **Rename Method** | Comments, Alternative Classes with Different Interfaces |
| **Add Parameter** | Alternative Classes with Different Interfaces |
| **Remove Parameter** | Speculative Generality |
| **Separate Query from Modifier** | — (design principle, CQS) |
| **Parameterize Method** | Duplicate Code |
| **Replace Parameter with Explicit Methods** | Switch Statements |
| **Preserve Whole Object** | Long Parameter List, Data Clumps |
| **Replace Parameter with Method Call** | Long Parameter List |
| **Introduce Parameter Object** | Long Parameter List, Data Clumps, Primitive Obsession, Long Method |
| **Remove Setting Method** | Data Class |
| **Hide Method** | Inappropriate Intimacy |
| **Replace Constructor with Factory Method** | Switch Statements (in constructors) |
| **Replace Error Code with Exception** | Primitive Obsession (error codes) |
| **Pull Up Method** | Duplicate Code |
| **Pull Up Field** | Duplicate Code |
| **Extract Subclass** | Large Class, Divergent Change |
| **Extract Superclass** | Duplicate Code, Refused Bequest, Alternative Classes with Different Interfaces, Divergent Change |
| **Extract Interface** | Large Class, Alternative Classes with Different Interfaces |
| **Collapse Hierarchy** | Lazy Class, Speculative Generality |
| **Form Template Method** | Duplicate Code (similar structure in subclasses) |
| **Replace Inheritance with Delegation** | Refused Bequest, Inappropriate Intimacy |
| **Replace Delegation with Inheritance** | Middle Man |
| **Duplicate Observed Data** | Large Class (GUI+domain mix) |
| **Change Bidirectional to Unidirectional** | Inappropriate Intimacy |
