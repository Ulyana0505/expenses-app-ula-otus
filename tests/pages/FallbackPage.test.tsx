import { render } from "@testing-library/react";

import FallbackPage from "../../src/pages/FallbackPage";

describe("FallbackPage", () => {
  it("default", async () => {
    const result = render(<FallbackPage />);
    expect(result.container.innerHTML.includes("<div>")).toEqual(true);
  });
});
