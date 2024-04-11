import { wait } from "./func";
import { act } from "@testing-library/react";

describe("main", () => {
  it("default", async () => {
    const d = document.createElement("div");
    d.id = "root";
    document.body.appendChild(d);
    await act(async () => {
      require("../src/main");
      await wait(100);
    });
    expect(document.body.innerHTML.includes("<nav>")).toEqual(true);
    expect(document.title).toEqual("Главная");
  });
});
