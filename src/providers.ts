import { Injectable } from "./injectable";
import { InjectionToken } from "./injection-token";

/**
 * Maps an injection token to an injectable class.
 *
 * Injectable classes must respect the contract defined in the `Injectable` interface, namely:
 * - a constructor containing a single object as argument,
 * - a static `inject` object, mapping an injection token to each key of the constructor's argument.
 */
export interface ClassProvider<T, U, V> {
  provide: InjectionToken<T>;
  useClass: Injectable<U, V>;
}

/**
 * Maps an injection token to a factory method.
 */
export interface FactoryProvider<T, U> {
  provide: InjectionToken<T>;
  useFactory: () => U;
}

/**
 * Maps an injection token to aconcrete instance.
 */
export interface ValueProvider<T> {
  provide: InjectionToken<T>;
  useValue: T;
}

/**
 * Maps an injection token to an injectable, factory, or concrete instance.
 */
export type Provider<T, U, V> = ClassProvider<T, U, V> | FactoryProvider<T, V> | ValueProvider<T>;
