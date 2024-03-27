import { getAppRender, initialPage } from "../func";
import ReportPage from "../../src/pages/ReportPage";
import { TreeRow, UserTable } from "../../src/types";
import { currentUserSave, storageSave } from "../../src/storage";
import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes, useLocation } from "react-router-dom";
import { openReport } from "../../src/router";
import { report_type_chart, report_type_table } from "../../src/utils";

jest.mock("react-apexcharts", () => ({ __esModule: true, default: jest.fn() }));

describe("ReportPage", () => {
  const userName = "1";
  const userPass = "2";
  it("default", async () => {
    const result = getAppRender(ReportPage);
    result.unmount();
  });
  it("with auth", async () => {
    const id10 = "id-10";
    const id11 = "id-11";
    const id20 = "id-20";
    const label1 = "label-1";
    const tree = [
      { id: id10, label: label1, children: [{ id: id11, label: "label-11" }] },
      { id: id20, label: "label-2" }
    ] as TreeRow[];

    const start = new Date();
    start.setDate(1);
    const dateFrom = start.toJSON().substring(0, 10);
    const dateTo = new Date().toJSON().substring(0, 10);

    const table = [
      {
        date: dateFrom,
        rows: [
          { id: id10, value: 1, children: [{ id: id11, value: 2 }] },
          { id: id20, value: 5 }
        ]
      },
      {
        date: dateTo,
        rows: [
          { id: id10, value: 1, children: [{ id: id11, value: 2 }] },
          { id: id20, value: 5 }
        ]
      }
    ] as UserTable[];
    currentUserSave(userName, userPass);
    storageSave(userName, userPass, tree, table);
    let pathResult = "-";

    function App() {
      pathResult = useLocation().pathname;
      return (
        <>
          <Routes>
            <Route path="report/:url_param" Component={ReportPage} />
            <Route path="*" Component={ReportPage} />
          </Routes>
        </>
      );
    }

    const result = getAppRender(App);

    const btnOpen = result.container.querySelector("button");
    const inputs = result.container.querySelectorAll("input");
    const inputRadioTable = inputs[2];
    const inputRadioChart = inputs[3];

    expect(pathResult).toEqual(initialPage);
    await waitFor(async () => await userEvent.click(btnOpen));
    expect(pathResult).toEqual(initialPage);

    await waitFor(async () => await userEvent.click(inputRadioTable));
    await waitFor(async () => await userEvent.click(btnOpen));
    expect(pathResult).toEqual(openReport(report_type_table, dateFrom, dateTo));

    await waitFor(async () => await userEvent.click(inputRadioChart));
    await waitFor(async () => await userEvent.click(btnOpen));
    expect(pathResult).toEqual(openReport(report_type_chart, dateFrom, dateTo));

    result.unmount();
  });
});
