---
title: 'Mastering TypeScript Patterns for Production Code'
description: 'Practical TypeScript patterns that make your code safer and more maintainable — discriminated unions, branded types, exhaustive checks, and builder patterns.'
pubDate: 'Feb 05 2026'
tags: ['typescript', 'patterns', 'javascript']
---

TypeScript's type system goes far beyond annotating variables with `string` or `number`. The real power emerges when you use the type system to model your domain accurately — making invalid states unrepresentable and pushing error detection to compile time.

In this guide, we will walk through the most impactful TypeScript patterns used in production codebases. These are not theoretical exercises — they are patterns that teams at companies like Stripe, Vercel, and Shopify rely on every day to ship reliable software. Each pattern solves a specific category of bug, and together they form a toolkit that dramatically reduces the surface area for runtime errors. Whether you are building a REST API, a React application, or a command-line tool, these patterns will change how you think about type safety.

## Discriminated Unions

The most underused TypeScript pattern is the discriminated union. Instead of optional fields that may or may not be present, you model each state explicitly. This eliminates the entire class of null-check bugs where a developer forgets to verify which fields exist before accessing them. Every state transition becomes visible in the type system, and the compiler guides you through handling each case. The pattern works especially well for API response handling, form state management, and workflow state machines where each state carries different data.

```typescript
// ❌ Optional fields — caller must guess which are set
interface ApiResponse {
  data?: User;
  error?: string;
  loading?: boolean;
}

// ✅ Discriminated union — each state is explicit
type ApiResponse =
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: string };

function handleResponse(response: ApiResponse) {
  switch (response.status) {
    case 'loading':
      return <Spinner />;
    case 'success':
      // TypeScript knows `data` exists here
      return <UserProfile user={response.data} />;
    case 'error':
      // TypeScript knows `error` exists here
      return <ErrorBanner message={response.error} />;
  }
}
```

The compiler enforces that you handle every case. If you add a new status later, TypeScript tells you every switch statement that needs updating. This is the key advantage over boolean flags or optional properties — the compiler becomes your safety net during refactoring.

## Exhaustive Checks

Combine discriminated unions with an exhaustive check to catch missing cases at compile time rather than discovering them in production. The technique relies on the `never` type, which represents values that should never occur. When TypeScript narrows a union through control flow, the remaining type in the default branch should be `never` if you have handled every variant. If you add a new variant to the union, the default branch will no longer receive `never`, and the compiler will report a type error pointing you directly to the switch statement that needs updating.

```typescript
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}

function getStatusColor(status: ApiResponse['status']): string {
  switch (status) {
    case 'loading':
      return 'gray';
    case 'success':
      return 'green';
    case 'error':
      return 'red';
    default:
      return assertNever(status);
  }
}
```

If someone adds `'retrying'` to the union, `assertNever` will produce a compile-time error because `'retrying'` is not assignable to `never`.

## Branded Types

Primitive types like `string` and `number` don't carry semantic meaning. A `userId` and a `postId` are both strings, but passing one where the other is expected is a bug that TypeScript will not catch with plain string types. This category of error is surprisingly common in large codebases where functions accept multiple string parameters. Branded types solve this by creating nominal subtypes of primitives — types that are structurally identical to their base type but are treated as distinct types by the compiler. The technique uses an intersection with a phantom property that exists only at the type level and has no runtime cost.

```typescript
// Create a branded type using intersection with a symbol
type Brand<T, B extends string> = T & { readonly __brand: B };

type UserId = Brand<string, 'UserId'>;
type PostId = Brand<string, 'PostId'>;

// Constructor functions that validate and brand
function createUserId(id: string): UserId {
  if (!id.startsWith('usr_')) {
    throw new Error(`Invalid user ID format: ${id}`);
  }
  return id as UserId;
}

function createPostId(id: string): PostId {
  if (!id.startsWith('post_')) {
    throw new Error(`Invalid post ID format: ${id}`);
  }
  return id as PostId;
}

// Now the compiler prevents mixups
function getPost(postId: PostId): Post { /* ... */ }
function getUser(userId: UserId): User { /* ... */ }

const userId = createUserId('usr_abc123');
const postId = createPostId('post_xyz789');

getPost(userId); // ✗ Compile error — UserId is not PostId
getPost(postId); // ✓ Works
```

## Builder Pattern with Type Safety

The builder pattern in TypeScript can enforce required fields at the type level. Traditional builders in languages like Java rely on runtime validation — you call build and get an exception if required fields are missing. In TypeScript, we can do better by using generic type parameters to track which fields have been set. The build method is only callable when the type parameter indicates all required fields are present. This means misconfigured builders are caught at compile time, not at runtime during testing or in production. The pattern is particularly useful for configuration objects, database queries, and HTTP request builders where missing fields cause subtle failures.

```typescript
interface Config {
  host: string;
  port: number;
  database: string;
  ssl?: boolean;
}

type RequiredKeys = 'host' | 'port' | 'database';

class ConfigBuilder<Built extends string = never> {
  private config: Partial<Config> = {};

  host(value: string): ConfigBuilder<Built | 'host'> {
    this.config.host = value;
    return this as any;
  }

  port(value: number): ConfigBuilder<Built | 'port'> {
    this.config.port = value;
    return this as any;
  }

  database(value: string): ConfigBuilder<Built | 'database'> {
    this.config.database = value;
    return this as any;
  }

  ssl(value: boolean): ConfigBuilder<Built> {
    this.config.ssl = value;
    return this;
  }

  build(this: ConfigBuilder<RequiredKeys>): Config {
    return this.config as Config;
  }
}

// Usage — build() only available when all required fields are set
const config = new ConfigBuilder()
  .host('localhost')
  .port(5432)
  .database('myapp')
  .ssl(true)
  .build(); // ✓ All required keys provided
```

## Utility Types in Practice

TypeScript ships with a rich set of utility types that transform existing types. Mastering these avoids boilerplate and keeps your codebase DRY. Instead of manually defining separate types for each use case, you can derive them from a single source of truth. This approach means that when you add a field to your base type, every derived type automatically picks it up — no manual synchronization needed. The most commonly used utility types are Pick, Omit, Record, and Partial, but TypeScript provides many more including Required, Readonly, Extract, Exclude, and NonNullable.

### Pick and Omit

`Pick` creates a type with only the specified keys from an existing type. `Omit` does the opposite — it creates a type with all keys except the ones you exclude:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Only expose safe fields to the client
type PublicUser = Pick<User, 'id' | 'name' | 'email'>;

// Everything except sensitive fields
type SafeUser = Omit<User, 'password'>;

// Create input types that exclude server-generated fields
type CreateUserInput = Omit<User, 'id' | 'createdAt'>;
```

### Record and Partial

`Record` creates an object type with specific key and value types. `Partial` makes all properties optional — invaluable for update operations:

```typescript
// Map status codes to messages
type StatusMessages = Record<'success' | 'error' | 'pending', string>;

const messages: StatusMessages = {
  success: 'Operation completed',
  error: 'Something went wrong',
  pending: 'Please wait...',
};

// Partial for update payloads — only send what changed
function updateUser(id: string, updates: Partial<User>): User {
  const existing = getUserById(id);
  return { ...existing, ...updates };
}

updateUser('usr_123', { name: 'New Name' }); // Only updates name
```

## Conditional Types

Conditional types let you express type-level `if/else` logic. They follow the syntax `T extends U ? X : Y`. This is one of the most powerful features in TypeScript's type system because it enables you to write types that adapt based on their input. Conditional types are the foundation of many advanced patterns — type inference, recursive types, and distributive type operations all build on this primitive. Libraries like Zod, tRPC, and Prisma use conditional types extensively to provide type-safe APIs that feel magical to use but are grounded in solid type theory.

```typescript
// Extract the return type of a function
type ReturnOf<T> = T extends (...args: any[]) => infer R ? R : never;

type StringFn = ReturnOf<() => string>; // string
type NumberFn = ReturnOf<() => number>; // number

// Unwrap a Promise type
type Unwrap<T> = T extends Promise<infer U> ? U : T;

type Result = Unwrap<Promise<string>>; // string
type Plain = Unwrap<number>;           // number

// Filter union members
type ExtractStrings<T> = T extends string ? T : never;
type OnlyStrings = ExtractStrings<string | number | boolean>; // string
```

The `infer` keyword is particularly powerful — it lets you "capture" a type from within a conditional check and use it in the true branch.

## Template Literal Types

Template literal types let you manipulate string types at the type level. Combined with mapped types, they unlock patterns like type-safe event emitters and route definitions. Before template literal types were introduced in TypeScript 4.1, these patterns required extensive manual type definitions or runtime validation. Now you can express string-level constraints directly in the type system, which means the compiler catches typos in event names, CSS values, and API paths at compile time rather than at runtime.

```typescript
// Create event handler names from event types
type EventName = 'click' | 'focus' | 'blur';
type HandlerName = `on${Capitalize<EventName>}`;
// Result: 'onClick' | 'onFocus' | 'onBlur'

// Build CSS property types
type CSSUnit = 'px' | 'em' | 'rem' | '%';
type CSSValue = `${number}${CSSUnit}`;

const width: CSSValue = '100px';   // ✓
const height: CSSValue = '2.5rem'; // ✓

// Type-safe route params
type Route = '/users/:id' | '/posts/:slug/comments/:commentId';

type ExtractParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractParams<`/${Rest}`>
    : T extends `${string}:${infer Param}`
      ? Param
      : never;

type UserParams = ExtractParams<'/users/:id'>; // 'id'
type CommentParams = ExtractParams<'/posts/:slug/comments/:commentId'>; // 'slug' | 'commentId'
```

## Type Guards and Narrowing

Type guards let you narrow a union type to a specific member at runtime, with full type safety. While TypeScript automatically narrows types through control flow analysis — for example, checking a discriminant property in an if statement — custom type guards give you the power to define your own narrowing logic for complex scenarios. This is essential when working with external data, API responses, or polymorphic collections where the shape of the data varies at runtime but follows patterns you can validate.

```typescript
// User-defined type guard with `is` keyword
interface Dog {
  kind: 'dog';
  bark(): void;
}

interface Cat {
  kind: 'cat';
  purr(): void;
}

type Animal = Dog | Cat;

function isDog(animal: Animal): animal is Dog {
  return animal.kind === 'dog';
}

function interact(animal: Animal) {
  if (isDog(animal)) {
    animal.bark(); // TypeScript knows this is Dog
  } else {
    animal.purr(); // TypeScript knows this is Cat
  }
}

// Assertion functions — throw instead of returning boolean
function assertDefined<T>(
  value: T | null | undefined,
  message: string
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}

const config = getConfig();
assertDefined(config, 'Config must be loaded');
// After this line, TypeScript knows config is non-null
console.log(config.port);
```

## Using These Patterns Together

In a real application, these patterns compose naturally. You model your domain with discriminated unions, protect ID boundaries with branded types, enforce configuration completeness with builders, use utility types to derive API contracts from your domain model, and catch every state transition with exhaustive checks.

The upfront investment in types pays dividends in every code review, refactor, and production incident you avoid. TypeScript's type system is a design tool — use it to make your intentions explicit and your mistakes visible at compile time.
