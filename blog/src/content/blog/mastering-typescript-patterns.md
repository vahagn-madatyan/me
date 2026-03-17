---
title: 'Mastering TypeScript Patterns for Production Code'
description: 'Practical TypeScript patterns that make your code safer and more maintainable — discriminated unions, branded types, exhaustive checks, and builder patterns.'
pubDate: 'Feb 05 2026'
tags: ['typescript', 'patterns', 'javascript']
---

TypeScript's type system goes far beyond annotating variables with `string` or `number`. The real power emerges when you use the type system to model your domain accurately — making invalid states unrepresentable and pushing error detection to compile time.

## Discriminated Unions

The most underused TypeScript pattern is the discriminated union. Instead of optional fields that may or may not be present, you model each state explicitly:

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

The compiler enforces that you handle every case. If you add a new status later, TypeScript tells you every switch statement that needs updating.

## Exhaustive Checks

Combine discriminated unions with an exhaustive check to catch missing cases:

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

Primitive types like `string` and `number` don't carry semantic meaning. A `userId` and a `postId` are both strings, but passing one where the other is expected is a bug:

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

The builder pattern in TypeScript can enforce required fields at the type level:

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

## Using These Patterns Together

In a real application, these patterns compose naturally. You model your domain with discriminated unions, protect ID boundaries with branded types, enforce configuration completeness with builders, and catch every state transition with exhaustive checks.

The upfront investment in types pays dividends in every code review, refactor, and production incident you avoid. TypeScript's type system is a design tool — use it to make your intentions explicit and your mistakes visible at compile time.
