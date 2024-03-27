import {
  currentUserDrop,
  currentUserKey,
  currentUserLoad,
  currentUserSave,
  storageKey,
  storageLoad,
  storageSave
} from "../src/storage";

describe("storage", () => {
  it("currentUserSave", async () => {
    currentUserSave("1", "2");
    expect(localStorage.getItem(currentUserKey)).toEqual(`["1","2"]`);
  });
  it("currentUserLoad", async () => {
    expect(currentUserLoad()).toEqual(["1", "2"]);
    localStorage.setItem(currentUserKey, "++");
    expect(currentUserLoad()).toEqual([]);
  });
  it("currentUserDrop", async () => {
    expect(localStorage.length).toEqual(1);
    currentUserDrop();
    expect(localStorage.length).toEqual(0);
  });
  it("storageLoad", async () => {
    expect(storageLoad("1", "2")).toEqual(null);
  });
  it("storageSave", async () => {
    storageSave("1", "2", [], []);
    expect(localStorage.getItem(storageKey("1"))).toEqual(`{"key":"2","tree":[],"table":[]}`);
  });
});
