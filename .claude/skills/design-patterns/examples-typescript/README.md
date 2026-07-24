# Ejemplos de patrones de diseño (TypeScript)

Equivalente en TypeScript de los ejemplos en Python de `../examples/`. Cada
archivo contiene un patrón GoF con su estructura conceptual (interfaces,
clases abstractas y concretas) **sin el bloque de demostración/salida** que
imprime por consola, igual que las versiones Python omiten el bloque
`if __name__ == "__main__"`.

Fuente: [Refactoring.Guru — Design Patterns in TypeScript](https://refactoring.guru/design-patterns/typescript)
(© Alexander Shvets, CC BY-NC-ND 4.0).

## Patrones incluidos (21)

| Creacionales | Estructurales | De comportamiento |
|---|---|---|
| `abstract_factory.ts` | `adapter.ts` | `chain_of_responsibility.ts` |
| `builder.ts` | `bridge.ts` | `command.ts` |
| `factory_method.ts` | `composite.ts` | `iterator.ts` |
| `prototype.ts` | `decorator.ts` | `mediator.ts` |
| `singleton.ts` | `facade.ts` | `memento.ts` |
| | `flyweight.ts` | `observer.ts` |
| | `proxy.ts` | `state.ts` |
| | | `strategy.ts` (ver nota) |
| | | `template_method.ts` |
| | | `visitor.ts` |

> **Nota sobre diferencias con Python**: la fuente TypeScript unifica en un solo
> archivo lo que en Python son variantes separadas: `adapter.ts` cubre
> `adapter_class.py` + `adapter_object.py`, y `singleton.ts` cubre
> `singleton_NonThreadSafe.py` + `singleton_ThreadSafe.py`. Por eso hay 21
> archivos aquí frente a 24 en Python.

## Decisiones de extracción

- **`export {}` al final de cada archivo**: convierte cada ejemplo en un módulo
  aislado. Sin esto, al ser *scripts* comparten el ámbito global y colisionan
  entre sí (todos redefinen `Component`, `clientCode`, etc.). Además evita que
  `proxy.ts` (clase `Proxy`) e `iterator.ts` (interfaz `Iterator<T>`) choquen con
  los tipos globales homónimos de TypeScript moderno.
- **`tsconfig.json` no estricto**: replica la configuración de la fuente original
  (TypeScript 3.3, `target: es2015`, sin `strict`). Los ejemplos priorizan la
  claridad didáctica sobre el cumplimiento de `--strict`.

## Verificar

```bash
cd .claude/skills/design-patterns/examples-typescript
npx tsc -p tsconfig.json   # comprueba tipos de los 21 archivos, sin emitir JS
```
