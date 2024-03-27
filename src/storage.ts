import { TreeRow, UserStorage, UserTable } from "./types";
import { bool } from "./utils";

export const currentUserKey = "current";

export function storageKey(value: string) {
  return `data-${value}`;
}

export function currentUserLoad(): string[] {
  try {
    const data = JSON.parse(localStorage.getItem(currentUserKey) || "[]");
    if (Array.isArray(data) && data.length == 2) {
      return data;
    }
    return [];
  } catch (e) {
    return [];
  }
}

export function currentUserSave(userName: string, userPass: string) {
  localStorage.setItem(currentUserKey, JSON.stringify([userName, userPass]));
}

export function currentUserDrop() {
  localStorage.removeItem(currentUserKey);
}

export function storageLoad(userName: string, userPass: string): UserStorage | null {
  try {
    const data = JSON.parse(localStorage.getItem(storageKey(userName))!) as UserStorage;
    return bool(data.key === userPass, data, null);
  } catch (e) {
    return null;
  }
}

export function storageSave(
  userName: string,
  userPass: string,
  tree: TreeRow[],
  table: UserTable[]
) {
  localStorage.setItem(
    storageKey(userName),
    JSON.stringify({ key: userPass, tree, table } as UserStorage)
  );
}
