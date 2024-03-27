import { RouteHandle, TableRow } from "./types";

export const report_type_table = "table" as const;
export const report_type_chart = "chart" as const;

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
