import { useAuth } from "../auth";
import RequiredAuthPage from "./RequiredAuthPage";
import { useNavigate, useParams } from "react-router-dom";
import { useRef } from "react";
import { openReport } from "../router";
import { TableRow, TreeRow, UserTable } from "../types";
import { reportTypeChart, reportTypeTable, tableSum } from "../utils";
import { nanoid } from "nanoid";
import Chart from "react-apexcharts";

export default function ReportPage() {
  const auth = useAuth();
  if (!auth.isAuthenticated) {
    return <RequiredAuthPage />;
  }
  return <ViewReport />;
}

function getDates(src = "") {
  const l = src.split("_");
  if (
    l.length === 3 &&
    new Date(l[1]) instanceof Date &&
    new Date(l[2]) instanceof Date &&
    (l[0] === reportTypeTable || l[0] === reportTypeChart)
  ) {
    return { report_type: l[0], d_from: l[1], d_to: l[2] };
  }
  const start = new Date();
  start.setDate(1);
  return {
    report_type: "",
    d_from: start.toJSON().substring(0, 10),
    d_to: new Date().toJSON().substring(0, 10)
  };
}

function getRows(d1_t: string, d2_t: string, rows: UserTable[]): UserTable[] {
  const d1 = new Date(d1_t).getTime();
  const d2 = new Date(d2_t).getTime();

  return rows.filter((r) => {
    const d = new Date(r.date).getTime();
    return d >= d1 && d <= d2;
  });
}

function treeMap(tree: TreeRow[], map = new Map<string, string>()) {
  for (const row of tree) {
    map.set(row.id, row.label);
    if (row.children) {
      treeMap(row.children, map);
    }
  }
  return map;
}

function ViewReport() {
  const navigate = useNavigate();
  const { url_param } = useParams();
  const auth = useAuth();
  const refD1 = useRef<HTMLInputElement>(null);
  const refD2 = useRef<HTMLInputElement>(null);
  const refType1 = useRef<HTMLInputElement>(null);
  const refType2 = useRef<HTMLInputElement>(null);

  const { d_from, d_to, report_type } = getDates(url_param);
  const rows = getRows(d_from, d_to, auth.dataTable);
  const map = treeMap(auth.dataTree);

  function handleOpen() {
    const date1 = refD1.current!.valueAsDate;
    const date2 = refD2.current!.valueAsDate;
    const chart_type =
      (refType1.current!.checked && reportTypeTable) ||
      (refType2.current!.checked && reportTypeChart);
    if (chart_type && date1 && date2) {
      navigate(
        openReport(chart_type, date1.toJSON().substring(0, 10), date2.toJSON().substring(0, 10))
      );
    }
  }

  return (
    <>
      <h2>Отчет</h2>
      <p>
        от: <input defaultValue={d_from} type="date" ref={refD1} /> до:{" "}
        <input defaultValue={d_to} type="date" ref={refD2} />
        <input
          type="radio"
          name="type"
          id={reportTypeTable}
          value={reportTypeTable}
          defaultChecked={report_type ? report_type === reportTypeTable : void 0}
          ref={refType1}
        />
        <label htmlFor={reportTypeTable}>таблица</label>
        <input
          type="radio"
          name="type"
          id={reportTypeChart}
          value={reportTypeChart}
          defaultChecked={report_type ? report_type === reportTypeChart : void 0}
          ref={refType2}
        />
        <label htmlFor={reportTypeChart}>диаграмма</label>
        <button onClick={handleOpen}>открыть</button>
      </p>
      {report_type === reportTypeTable && <ViewTable rows={rows} map={map} />}
      {report_type === reportTypeChart && <ViewChart rows={rows} map={map} />}
    </>
  );
}

function ViewChart({ rows, map }: { rows: UserTable[]; map: Map<string, string> }) {
  const data = dataChart(rows, map);

  const series = data.map((r) => r.sum);
  const options = {
    chart: {
      type: "donut"
    },
    labels: data.map((r) => r.label),
    legend: { labels: { colors: "white" } },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  } as ApexCharts.ApexOptions;
  return <Chart options={options} series={series} type="donut" width={500} />;
}

function ViewTable({ rows, map }: { rows: UserTable[]; map: Map<string, string> }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Дата</th>
          <th>Категория</th>
          <th>Сумма</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <ViewTableRow key={row.date} row={row} map={map} />
        ))}
      </tbody>
    </table>
  );
}

function ViewTableRow({ row, map }: { row: UserTable; map: Map<string, string> }) {
  const rows = getFlat(row.rows, map).filter((r) => r.sum);

  return (
    <>
      <tr>
        <td>{row.date}</td>
        <td></td>
        <td></td>
      </tr>
      {rows.map((r) => (
        <tr key={r.id}>
          <td></td>
          <td>{"-".repeat(r.level) + r.label}</td>
          <td>{r.sum}</td>
        </tr>
      ))}
    </>
  );
}

type ChartRow = { sum: number; label: string };

function dataChart(rows: UserTable[], legend: Map<string, string>): ChartRow[] {
  const total = new Map<string, ChartRow>();

  for (const row1 of rows) {
    for (const row2 of getFlat(row1.rows, legend)) {
      if (!row2.level) {
        const totalRow = total.get(row2.label);
        if (totalRow) {
          totalRow.sum += row2.sum;
        } else {
          total.set(row2.label, { sum: row2.sum, label: row2.label });
        }
      }
    }
  }

  return [...total.values()];
}

type ResRow = { id: string; sum: number; label: string; level: number };

function getFlat(
  rows: TableRow[],
  map: Map<string, string>,
  level = 0,
  results = [] as ResRow[]
): ResRow[] {
  for (const r of rows) {
    const sum = r.value + (r.children ? tableSum(r.children) : 0);
    results.push({ id: nanoid(), level, sum, label: map.get(r.id) as string });
    if (r.children) {
      getFlat(r.children, map, level + 1, results);
    }
  }
  return results;
}
