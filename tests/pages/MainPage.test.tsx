import { getAppRender } from "../func";
import MainPage from "../../src/pages/MainPage";
import { currentUserSave, storageLoad, storageSave } from "../../src/storage";
import { TreeRow, UserTable } from "../../src/types";
import { fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("MainPage", () => {
  const userName = "1";
  const userPass = "2";
  it("default", async () => {
    const result = getAppRender(MainPage);
    expect(result.container.innerHTML.includes("<h2>")).toEqual(true);
    result.unmount();
  });
  it("with auth", async () => {
    const currentDate = new Date().toJSON().substring(0, 10);
    const tree = [
      { id: "id-1", label: "label-1", children: [{ id: "id-2", label: "label-2" }] }
    ] as TreeRow[];
    const table = [{ date: "2010-01-01", rows: [] }] as UserTable[];
    currentUserSave(userName, userPass);
    storageSave(userName, userPass, tree, table);
    const result = getAppRender(MainPage);

    const button = result.container.querySelector("button");
    const inputs = result.container.querySelectorAll("input");
    expect(inputs.length).toEqual(3);

    await waitFor(async () => await userEvent.click(button));
    expect(result.getAllByText("Выберите дату").length).toEqual(1);

    const inputDate = inputs[0];
    const inputFirstValue = inputs[1];
    inputDate.value = currentDate;
    await waitFor(async () => await userEvent.click(button));
    expect(result.getAllByText("Введите данные").length).toEqual(1);

    // вводим не число
    await waitFor(async () => fireEvent.input(inputFirstValue, { target: { value: "aa" } }));
    // вводим число
    await waitFor(async () => fireEvent.input(inputFirstValue, { target: { value: "5" } }));

    expect(storageLoad(userName, userPass).table.length).toEqual(1);
    await waitFor(async () => await userEvent.click(button));
    expect(storageLoad(userName, userPass).table.length).toEqual(2);
  });
});
