/**
 * Jest Type Definitions
 * This file ensures TypeScript recognizes Jest globals
 * Note: Install @types/jest for full support: npm install --save-dev @types/jest
 */

/// <reference types="jest" />

// Ensure Jest namespace and globals are available
declare namespace jest {
  interface Mock<T = any> {
    (...args: any[]): T;
    mockReturnValue(value: T): this;
    mockResolvedValue(value: T): this;
    mockRejectedValue(value: any): this;
    mockReturnThis(): this;
    mockImplementation(fn: (...args: any[]) => T): this;
    mockClear(): this;
    mockReset(): this;
    mockRestore(): this;
  }

  interface MockedFunction<T extends (...args: any[]) => any> extends Mock<ReturnType<T>> {
    (...args: Parameters<T>): ReturnType<T>;
  }

  interface Jest {
    fn<T = any>(implementation?: (...args: any[]) => T): Mock<T>;
    spyOn<T extends object, M extends keyof T>(object: T, method: M): T[M] extends (...args: any[]) => infer R
      ? R extends Promise<infer U>
        ? SpyInstance<U>
        : SpyInstance<R>
      : SpyInstance<any>;
    clearAllMocks(): void;
    resetAllMocks(): void;
    restoreAllMocks(): void;
    mock(moduleName: string, factory?: () => any): any;
  }
  
  interface SpyInstance<T = any> extends Mock<T> {
    mockRestore(): void;
    mockImplementation(fn: (...args: any[]) => T | Promise<T>): this;
    mockResolvedValue(value: T): this;
    mockRejectedValue(value: any): this;
  }

  interface Describe {
    (name: string, fn: () => void): void;
  }

  interface It {
    (name: string, fn: () => void | Promise<void>): void;
  }

  interface ExpectStatic {
    <T = any>(actual: T): T extends Promise<any> 
      ? Matchers<T> & {
          rejects: PromiseMatchers<Promise<any>>;
          resolves: Matchers<T extends Promise<infer U> ? U : T>;
        }
      : Matchers<T>;
    objectContaining(obj: any): any;
    any(constructor: any): any;
  }

  interface Matchers<T> {
    not: Matchers<T>;
    toBe(expected: T | any): void;
    toEqual(expected: T | any): void;
    toHaveBeenCalled(): void;
    toHaveBeenCalledWith(...args: any[]): void;
    toHaveProperty(prop: string): void;
    toBeNull(): void;
    toBeDefined(): void;
    toBeTruthy(): void;
    toBeFalsy(): void;
    toContain(item: any): void;
    toMatch(regexp: RegExp | string): void;
    toBeGreaterThan(expected: number): void;
    toBeGreaterThanOrEqual(expected: number): void;
    toBeLessThan(expected: number): void;
    toBeLessThanOrEqual(expected: number): void;
  }

  interface PromiseMatchers<T> extends Matchers<T> {
    rejects: PromiseMatchers<Promise<any>>;
    resolves: Matchers<T>;
    toThrow(error?: string | RegExp | Error): Promise<void>;
    toThrowError(error?: string | RegExp | Error): Promise<void>;
  }

  interface Lifecycle {
    (fn: () => void | Promise<void>): void;
  }
}

declare const jest: jest.Jest;
declare const describe: jest.Describe;
declare const it: jest.It;
declare const test: jest.It;
declare const expect: jest.ExpectStatic;
declare const beforeAll: jest.Lifecycle;
declare const afterAll: jest.Lifecycle;
declare const beforeEach: jest.Lifecycle;
declare const afterEach: jest.Lifecycle;

