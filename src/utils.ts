import { RouteHandle, TableRow } from "./types";

export const reportTypeTable = "table" as const;
export const reportTypeChart = "chart" as const;

export function getHandle(route: { handle?: unknown }) {
  return route.handle as RouteHandle;
}

export function alwaysVoid() {}

export function bool<T>(flag: boolean, _then: T, _else: T): T {
  return flag ? _then : _else;
}

export function tableSum(rows: TableRow[]): number {
  return rows.reduce((a, b) => (b.children ? tableSum(b.children) : 0) + a + b.value, 0);
}
