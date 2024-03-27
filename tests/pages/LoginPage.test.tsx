import LoginPage from "../../src/pages/LoginPage";
import { getAppRender, initialPage } from "../func";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";
import { useLocation } from "react-router-dom";

describe("LoginPage", () => {
  it("default", async () => {
    let pathResult = "-";

    function App() {
      pathResult = useLocation().pathname;
      if (pathResult === initialPage) {
        return <LoginPage />;
      }
      return null;
    }

    const result = getAppRender(App);
    const button = result.container.querySelector("button");
    await waitFor(async () => await userEvent.click(button));
    expect(pathResult).toEqual(initialPage);

    const userName = "1";
    const userPass = "2";
    const input = result.container.querySelectorAll("input");
    input[0].value = userName;
    input[1].value = userPass;
    await waitFor(async () => await userEvent.click(button));
    expect(pathResult).toEqual("/");

    result.unmount();
  });
});
