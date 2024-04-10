import { useAuth } from "../auth";
import { FormEvent, useRef, useState } from "react";
import { TableRow, TreeRow } from "../types";
import { tableSum } from "../utils";

export default function MainPage() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <MainPersonal />;
  }
  return <MainShared />;
}

function MainShared() {
  return <h2>Здравтсвуй интернет путник.</h2>;
}

function rowsData(tree: TreeRow[]): TableRow[] {
  const rows = [] as TableRow[];
  for (const rowTree of tree) {
    const rowData: TableRow = { value: 0, id: rowTree.id };
    rows.push(rowData);
    if (rowTree.children) {
      rowData.children = rowsData(rowTree.children);
    }
  }
  return rows;
}

function MainPersonal() {
  const auth = useAuth();

  const [version, setVersion] = useState(0);
  const refInput = useRef<HTMLInputElement>(null);
  const refStruct = useRef<TableRow[]>(rowsData(auth.dataTree));
  const [error, setError] = useState("");

  function save() {
    setError("");
    const dateSource = refInput.current?.valueAsDate ?? "";
    if (dateSource) {
      const date = dateSource.toJSON().substring(0, 10);
      if (tableSum(refStruct.current)) {
        auth.dataTable = auth.dataTable.filter((r) => r.date !== date);
        auth.dataTable.push({ date, rows: refStruct.current });
        auth.dataTable.sort((a, b) => a.date.localeCompare(b.date));
        auth.setTable(auth.dataTable);
        setVersion((prev) => prev + 1);
      } else {
        setError("Введите данные");
      }
    } else {
      setError("Выберите дату");
    }
  }

  return (
    <>
      <h2>{`Добро пожаловать ${auth.userName}!`}</h2>
      <div style={{ color: "red" }}>{error}</div>
      <div>
        <input placeholder="Введите дату" type="date" ref={refInput} key={version} />
        <button onClick={save}>добавить</button>
      </div>
      <ViewTreeRows tree={auth.dataTree} data={refStruct.current} key={version} />
    </>
  );
}

function ViewTreeRows({ tree, data }: { tree: TreeRow[]; data: TableRow[] }) {
  return (
    <ul>
      {Array.from({ length: tree.length }).map((_, ind: number) => (
        <ViewTreeRow key={tree[ind].id} rowTree={tree[ind]} rowData={data[ind]} />
      ))}
    </ul>
  );
}

function ViewTreeRow({ rowTree, rowData }: { rowTree: TreeRow; rowData: TableRow }) {
  const ref = useRef<HTMLInputElement>(null);

  function handleInput(e: FormEvent<HTMLInputElement>) {
    rowData.value = (e.target as HTMLInputElement).valueAsNumber;
    if (Number.isNaN(rowData.value)) {
      rowData.value = 0;
    }
    ref.current!.value = String(rowData.value);
  }

  return (
    <li>
      <div>
        <small>{rowTree.label}</small>
      </div>
      <input onInput={handleInput} placeholder={rowTree.label} type="number" min={0} ref={ref} />
      {rowTree.children && rowData.children && (
        <ViewTreeRows tree={rowTree.children} data={rowData.children} />
      )}
    </li>
  );
}
