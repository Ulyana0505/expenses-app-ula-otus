import { getAppRender } from "../func";
import TunePage from "../../src/pages/TunePage";
import { TreeRow, UserTable } from "../../src/types";
import { currentUserSave, storageLoad, storageSave } from "../../src/storage";
import { fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("TunePage", () => {
  const userName = "1";
  const userPass = "2";
  it("default", async () => {
    const result = getAppRender(TunePage);
    result.unmount();
  });
  it("with auth", async () => {
    const tree = [] as TreeRow[];
    const table = [] as UserTable[];
    currentUserSave(userName, userPass);
    storageSave(userName, userPass, tree, table);
    const result = getAppRender(TunePage);

    const btnSave = result.getByTestId("save");
    const btnDrop = result.getByTestId("drop");

    const btnAddRoot = result.getByText("++");
    expect(storageLoad(userName, userPass).tree.length).toEqual(0);
    await waitFor(async () => await userEvent.click(btnAddRoot));
    expect(storageLoad(userName, userPass).tree.length).toEqual(1);

    const btnAddSub = result.getByText("+");
    expect(storageLoad(userName, userPass).tree[0].children).toEqual(void 0);
    await waitFor(async () => await userEvent.click(btnAddSub));
    expect(storageLoad(userName, userPass).tree[0].children!.length).toEqual(1);

    const input = result.container.querySelector("input");
    const label = "label-1";
    await waitFor(async () => fireEvent.input(input, { target: { value: label } }));
    expect(storageLoad(userName, userPass).tree[0].label).toEqual("");
    await waitFor(async () => await userEvent.click(btnSave));
    expect(storageLoad(userName, userPass).tree[0].label).toEqual(label);

    await waitFor(async () => await userEvent.click(btnDrop));
    expect(storageLoad(userName, userPass).tree.length).toEqual(0);

    result.unmount();
  });
});
