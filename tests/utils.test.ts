import { alwaysVoid, bool, getHandle, tableSum } from "../src/utils";
import { AgnosticRouteObject } from "@remix-run/router/utils";

describe("utils", () => {
  it("getHandle", async () => {
    expect(getHandle({ handle: {} } as AgnosticRouteObject)).toEqual({});
  });
  it("bool", async () => {
    expect(bool(true, 1, 3)).toEqual(1);
    expect(bool(false, 1, 3)).toEqual(3);
  });
  it("alwaysVoid", async () => {
    expect(alwaysVoid()).toEqual(void 0);
  });

  it("tableSum", async () => {
    expect(tableSum([{ id: "", value: 1, children: [{ id: "", value: 2 }] }])).toEqual(3);
  });
});
