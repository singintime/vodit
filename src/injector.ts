import { Injectable } from "./injectable";
import { InjectionToken } from "./injection-token";
import { Provider } from "./providers";

/**
 * The Injector resolves injectable dependencies to concrete instances.
 */
export class Injector {
  private providers: Map<InjectionToken<any>, Provider<any, any, any>> = new Map();
  private instances: Map<InjectionToken<any>, any> = new Map();

  /**
   * Registers a dependency provider.
   *
   * Returns true if the registration is successful, or false if a provider
   * with the same injection token is already registered.
   */
  register<T, U, V>(provider: Provider<T, U, V>): boolean {
    if (!this.providers.has(provider.provide)) {
      this.providers.set(provider.provide, provider);
      return true;
    }

    return false;
  }

  /**
   * Removes the dependency provided associated with the given injection token.
   * If the dependency was already resolved, removes the resolved instance too.
   */
  unregister<T>(token: InjectionToken<T>): void {
    this.providers.delete(token);
    this.instances.delete(token);
  }

  /**
   * Resolves a provided dependency, by either returning an already resolved
   * instance or creating a new one. Nested dependencies are resolved as well.
   */
  resolve<T>(token: InjectionToken<T>): T {
    return this.resolveInstance(token, []);
  }

  /**
   * Internal method, called by resolve() to resolve a dependency.The resolution
   * path is passed as argument, to detect and fail on circular dependencies.
   */
  private resolveInstance<T>(token: InjectionToken<T>, resolved: InjectionToken<any>[]): T {
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }

    if (!this.providers.has(token)) {
      throw new Error(`Missing dependency: ${token.name}`);
    }

    resolved.push(token);

    const index = resolved.indexOf(token);

    if (index < resolved.length - 1) {
      const cycle = resolved
        .slice(index)
        .map(token => token.name)
        .join(" -> ");

      throw new Error(`Dependency cycle detected: ${cycle}`);
    }

    const provider = this.providers.get(token)!;

    let newInstance: T;

    if ("useClass" in provider) {
      newInstance = this.createInstance(provider.useClass, resolved);
    } else if ("useFactory" in provider) {
      newInstance = provider.useFactory();
    } else {
      newInstance = provider.useValue;
    }

    this.instances.set(token, newInstance);

    return newInstance;
  }

  /**
   * Internal factory method to create the instance of a resolved dependency.
   */
  private createInstance<T, U>(ctor: Injectable<T, U>, resolved: InjectionToken<any>[]): U {
    const deps: any = {};

    for (const key in ctor.inject) {
      deps[key] = this.resolveInstance(ctor.inject[key], resolved);
    }

    return new ctor(deps);
  }
}
