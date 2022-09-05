# vodit

Minimalist dependency injector. No frills, no dependencies, no decorators.

## Description

This is yet another library that implements the
[inversion of control](https://en.wikipedia.org/inversion_of_control) (a.k.a.
[dependency injection](https://en.wikipedia.org/dependency_injection)) pattern. The reason for its
existence is that most other libraries out there make use of
[decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) to implement the pattern.
Since decorators are still an experimental feature, some people might want to avoid their usage
altogether in their projects.

## Installation

`npm run build`

## Running tests

`npm run test`

## How it works

Each injectable dependency is mapped to an `InjectionToken` by means of a `Provider`. Providers are
registered on an `Injector` object, that keeps track of the mappings and resolves the provided
dependencies to concrete instances.

Dependencies can be provided in three different ways: using an `Injectable` class (more on that
later), a factory method, or a concrete value. Providers are added or removed via the injector's
`register()` and `unregister()` methods.

The injector's `resolve()` method returns concrete instances of the provided dependencies. Those
instances are singletons - they're created once the first time they are resolved, and recycled every
other time they're requested.

When a provider is unregistered, the associated resolved instance is deleted. Therefore a way to
recreate an already resolved instance is unregistering a depedency provider, registering it back,
and resolve again the dependency.

`Injectable` instances must respect the following contract:

- a constructor containing a single object as argument,
- a static `inject` object, mapping an injection token to each key of the constructor's argument.

Nested dependencies are supported: an `Injectable` class can require instances of other injectable
objects as dependencies. If those dependencies are yet not resolved, the injector resolves them
before creating the instance.

Circular dependencies (i.e. A depends on B, and B depends on A), on the other hand, are very much
deliberately not supported and will throw a runtime error. The same applies for dependency loops of
any length (e.g. A -> B -> C -> A).

## Example code

```
// Injection tokens are used to retrieve dependencies
const A_TOKEN = new InjectionToken("A_TOKEN")
const B_TOKEN = new InjectionToken("B_TOKEN")
const C_TOKEN = new InjectionToken("C_TOKEN")

// Class respecting the Injectable contract:
class A {
    constructor(dependencies: {b: {x: string, y: string}, c: number})
    static inject = {b: B_TOKEN, c: C_TOKEN}
}

// Providers map tokens to dependency resolvers.
// Injectable classes, factory methods, and concrete instances are supported.
const providerA = {provide: A_TOKEN, useClass: A}
const providerB = {provide: B_TOKEN, useFactory: () => {x: "foo", y: "bar"}}
const providerC = {provide: C_TOKEN, useValue: 42}

// Injectors are used to register providers, and resolve instances
const injector = new Injector()

injector.register(providerA)
injector.register(providerB)
injector.register(providerC)

injector.resolve(A_TOKEN) // instance of A
injector.resolve(B_TOKEN) // {x: "foo", y: "bar"}
injector.resolve(C_TOKEN) // 42
```

## API documentation

Available [here](https://singintime.github.io/vodit).
