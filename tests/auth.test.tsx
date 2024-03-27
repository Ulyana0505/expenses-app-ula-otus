import { act, render } from "@testing-library/react";
import { AuthProvider, useAuth } from "../src/auth";
import { wait } from "./func";
import { Auth, TreeRow, UserTable } from "../src/types";
import { currentUserKey, currentUserSave, storageSave } from "../src/storage";

function getRender() {
  const context = { current: {} as Auth };

  function App() {
    context.current = useAuth();
    return null;
  }

  const result = render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );

  return { result, context };
}

describe("auth", () => {
  const userName = "1";
  const userPass = "2";

  it("default", async () => {
    const { context, result } = getRender();

    await act(async () => {
      context.current.login(userName, userPass);
      expect(localStorage.getItem(currentUserKey)).toEqual(`["${userName}","${userPass}"]`);
      await wait();
    });

    await act(async () => {
      context.current.setTree([]);
      context.current.setTable([]);
      await wait();
    });

    await act(async () => {
      expect(localStorage.length).toEqual(2);
      context.current.logout();
      expect(localStorage.length).toEqual(1);
      await wait();
    });

    result.unmount();
    localStorage.clear();
  });

  it("preload", async () => {
    const tree = [] as TreeRow[];
    const table = [] as UserTable[];
    currentUserSave(userName, userPass);
    storageSave(userName, userPass, tree, table);
    const { result, context } = getRender();
    expect(context.current.dataTree).toEqual(tree);
    expect(context.current.dataTable).toEqual(table);
    result.unmount();
  });
});
