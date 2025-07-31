declare module 'json-logic-js' {
  type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

  export function apply<T = unknown>(
    logic: { [key: string]: JsonValue },
    data?: { [key: string]: JsonValue }
  ): T;
}
