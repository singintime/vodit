import { InjectionToken } from "./injection-token";

/**
 * Interface defining the contract of an injectable service.
 */
export interface Injectable<T, U> {
  new (deps: T): U;
  readonly inject: Readonly<{ [K in keyof T]: InjectionToken<T[K]> }>;
}
