import { Injectable } from "./injectable";
import { InjectionToken } from "./injection-token";

/**
 * Class provider - maps an injection token to an injectable class.
 */
export interface ClassProvider<T, U, V> {
  provide: InjectionToken<T>;
  useClass: Injectable<U, V>;
}

/**
 * Factory provider - maps an injection token to a factory method.
 */
export interface FactoryProvider<T, U> {
  provide: InjectionToken<T>;
  useFactory: () => U;
}

/**
 * Value provider - maps an injection token to an already instantiated value.
 */
export interface ValueProvider<T> {
  provide: InjectionToken<T>;
  useValue: T;
}

/**
 * A Provider maps an injection token to an injectable, factory, or value.
 */
export type Provider<T, U, V> = ClassProvider<T, U, V> | FactoryProvider<T, V> | ValueProvider<T>;
