import { render } from "@testing-library/react";
import NotFoundPage from "../../src/pages/NotFoundPage";

describe("NotFoundPage", () => {
  it("default", async () => {
    const result = render(<NotFoundPage />);
    expect(result.container.innerHTML.includes("<div>")).toEqual(true);
    result.unmount();
  });
});
