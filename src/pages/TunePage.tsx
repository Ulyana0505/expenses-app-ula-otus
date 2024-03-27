import { useAuth } from "../auth";
import RequiredAuthPage from "./RequiredAuthPage";
import { TreeRow } from "../types";
import { nanoid } from "nanoid";
import { FormEvent } from "react";

export default function TunePage() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <RequiredAuthPage />;
  }
  return <TunePersonal />;
}

function TunePersonal() {
  const { dataTree, setTree, dropAll } = useAuth();

  function save() {
    setTree(dataTree);
  }

  function drop() {
    dropAll();
  }

  return (
    <>
      <h2>Настройка категорий</h2>
      <div>
        <button onClick={save} data-testid="save">
          сохранить изменения
        </button>
        <button onClick={drop} data-testid="drop">
          удалить все
        </button>
      </div>
      <ViewTreeRows rows={dataTree} save={save} />
    </>
  );
}

function ViewTreeRows({ rows, save }: { rows: TreeRow[]; save: () => void }) {
  function handleAdd() {
    rows.push({ id: nanoid(), label: "" });
    save();
  }

  return (
    <ul>
      {rows.map((r) => (
        <ViewTreeRow key={r.id} row={r} save={save} />
      ))}
      <li>
        <button onClick={handleAdd} title="добавить категорию">
          ++
        </button>
      </li>
    </ul>
  );
}

function ViewTreeRow({ row, save }: { row: TreeRow; save: () => void }) {
  function handleSubTree() {
    row.children = [...(row.children || []), { id: nanoid(), label: "" }];
    save();
  }

  function handleInput(e: FormEvent<HTMLInputElement>) {
    row.label = (e.target as HTMLInputElement).value.trim();
  }

  return (
    <li>
      <input defaultValue={row.label} onInput={handleInput} />
      <button title="добавить подкатегорию" onClick={handleSubTree}>
        +
      </button>
      {row.children && <ViewTreeRows rows={row.children} save={save} />}
    </li>
  );
}
