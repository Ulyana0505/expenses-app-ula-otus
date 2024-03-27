import { getAppRender, initialPage } from "../func";
import LogoutPage from "../../src/pages/LogoutPage";
import { useLocation } from "react-router-dom";

describe("LogoutPage", () => {
  it("default", async () => {
    let pathResult = "-";

    function App() {
      pathResult = useLocation().pathname;
      if (pathResult === initialPage) {
        return <LogoutPage />;
      }
      return null;
    }

    const result = getAppRender(App);

    expect(pathResult).toEqual("/");

    result.unmount();
  });
});
