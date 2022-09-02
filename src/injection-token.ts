/**
 * Injection tokens are used to identify dependencies.
 * They contain a name, and are typed to provide additional type safety.
 */
export class InjectionToken<T> {
  constructor(public readonly name: string) {}
}
