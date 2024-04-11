import { render } from "@testing-library/react";
import AboutPage from "../../src/pages/AboutPage";
import "@testing-library/jest-dom";

describe("AboutPage", () => {
  it("default", async () => {
    const result = render(<AboutPage />);
    expect(result.container.innerHTML.includes("<h2>")).toEqual(true);
  });
});
