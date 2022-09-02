import { InjectionToken } from "../src/injection-token";
import { Injector } from "../src/injector";

describe("Injector", () => {
  let injector: Injector;

  beforeEach(() => {
    injector = new Injector();
  });

  it("creates", () => {
    expect(injector).toBeTruthy();
  });

  it("registers a class provider", () => {
    class A {
      static inject = {};
    }

    const provider = { provide: new InjectionToken(""), useClass: A };

    expect(injector.register(provider)).toBe(true);
  });

  it("registers a factory provider", () => {
    const provider = { provide: new InjectionToken(""), useFactory: () => 42 };

    expect(injector.register(provider)).toBe(true);
  });

  it("registers a value provider", () => {
    const provider = { provide: new InjectionToken(""), useValue: "foo" };

    expect(injector.register(provider)).toBe(true);
  });

  it("does not register the same injection token twice", () => {
    const token = new InjectionToken("");
    const provider1 = { provide: token, useValue: "foo" };
    const provider2 = { provide: token, useValue: "bar" };

    expect(injector.register(provider1)).toBe(true);
    expect(injector.register(provider2)).toBe(false);
  });

  it("registers a previously unregistered injection token", () => {
    const token = new InjectionToken("");
    const provider1 = { provide: token, useValue: "foo" };
    const provider2 = { provide: token, useValue: "bar" };

    injector.register(provider1);
    injector.unregister(token);

    expect(injector.register(provider2)).toBe(true);
  });

  it("resolves a class provider", () => {
    class A {
      static inject = {};
    }

    const token = new InjectionToken("");
    const provider = { provide: token, useClass: A };

    injector.register(provider);

    expect(injector.resolve(token)).toBeInstanceOf(A);
  });

  it("resolves a factory provider", () => {
    const token = new InjectionToken("");
    const provider = { provide: token, useFactory: () => 42 };

    injector.register(provider);

    expect(injector.resolve(token)).toEqual(42);
  });

  it("resolves a value provider", () => {
    const token = new InjectionToken("");
    const provider = { provide: token, useValue: "foo" };

    injector.register(provider);

    expect(injector.resolve(token)).toEqual("foo");
  });

  it("resolves a class with nested dependencies", () => {
    const tokenA = new InjectionToken("");
    const tokenB = new InjectionToken("");
    const tokenC = new InjectionToken("");
    const tokenD = new InjectionToken("");

    class A {
      constructor(deps: { b: B; c: C }) {}
      static inject = { b: tokenB, c: tokenC };
    }

    class B {
      constructor(deps: { d: D }) {}
      static inject = { d: tokenD };
    }

    class C {
      static inject = {};
    }

    class D {
      static inject = {};
    }

    injector.register({ provide: tokenA, useClass: A });
    injector.register({ provide: tokenB, useClass: B });
    injector.register({ provide: tokenC, useClass: C });
    injector.register({ provide: tokenD, useClass: D });

    expect(injector.resolve(tokenA)).toBeInstanceOf(A);
  });

  it("resolves the same injection token with the same instance", () => {
    const token = new InjectionToken("");
    const provider = { provide: token, useFactory: () => ({}) };

    injector.register(provider);

    const resolved1 = injector.resolve(token);
    const resolved2 = injector.resolve(token);

    expect(resolved1).toBe(resolved2);
  });

  it("clears already resolved instances when a provider is unregistered", () => {
    const token = new InjectionToken("");
    const provider = { provide: token, useFactory: () => ({}) };

    injector.register(provider);

    const resolved1 = injector.resolve(token);

    injector.unregister(token);
    injector.register(provider);

    const resolved2 = injector.resolve(token);

    expect(resolved1).not.toBe(resolved2);
  });

  it("throws an error when trying to resolve an unregistered token", () => {
    expect(() => injector.resolve(new InjectionToken("foo"))).toThrowError(
      "Missing dependency: foo"
    );
  });

  it("throws an error when detecting a circular dependency", () => {
    const tokenA = new InjectionToken("A");
    const tokenB = new InjectionToken("B");
    const tokenC = new InjectionToken("C");
    const tokenD = new InjectionToken("D");

    class A {
      constructor(deps: { b: B }) {}
      static inject = { b: tokenB };
    }

    class B {
      constructor(deps: { c: C }) {}
      static inject = { c: tokenC };
    }

    class C {
      constructor(deps: { d: D }) {}
      static inject = { d: tokenD };
    }

    class D {
      constructor(deps: { b: B }) {}
      static inject = { b: tokenB };
    }

    injector.register({ provide: tokenA, useClass: A });
    injector.register({ provide: tokenB, useClass: B });
    injector.register({ provide: tokenC, useClass: C });
    injector.register({ provide: tokenD, useClass: D });

    expect(() => injector.resolve(tokenA)).toThrowError(
      "Dependency cycle detected: B -> C -> D -> B"
    );
  });
});
