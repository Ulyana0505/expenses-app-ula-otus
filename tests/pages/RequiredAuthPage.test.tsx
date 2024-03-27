import { render } from "@testing-library/react";
import RequiredAuthPage from "../../src/pages/RequiredAuthPage";

describe("RequiredAuthPage", () => {
  it("default", async () => {
    const result = render(<RequiredAuthPage />);
    expect(result.container.innerHTML.includes("<div>")).toEqual(true);
    result.unmount();
  });
});
