import { openReport } from "../src/router";

describe("router", () => {
  it("openReport", async () => {
    expect(openReport("1", "2", "3")).toEqual("/report/1_2_3");
  });
});
