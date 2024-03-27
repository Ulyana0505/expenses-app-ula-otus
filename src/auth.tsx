import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { Auth, TreeRow, UserTable } from "./types";
import { alwaysVoid, bool } from "./utils";
import {
  currentUserDrop,
  currentUserLoad,
  currentUserSave,
  storageLoad,
  storageSave
} from "./storage";

const AuthContext = createContext<Auth>(initAuthContext());

type State = Omit<
  Auth,
  "logout" | "login" | "setTree" | "dataTree" | "setTable" | "dataTable" | "dropAll"
>;

function initState(): State {
  return {
    isAuthenticated: false,
    userName: "",
    userPass: ""
  };
}

function initAuthContext(): Auth {
  return {
    ...initState(),
    dataTree: [],
    dataTable: [],
    login: alwaysVoid,
    logout: alwaysVoid,
    setTree: alwaysVoid,
    setTable: alwaysVoid,
    dropAll: alwaysVoid
  };
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initState());
  const [dataTree, setTreeState] = useState<TreeRow[]>([]);
  const [dataTable, setTableState] = useState<UserTable[]>([]);

  const login = useCallback((userName: string, userPass: string) => {
    setState({ isAuthenticated: true, userName, userPass });
    currentUserSave(userName, userPass);
    const source = storageLoad(userName, userPass);
    if (source) {
      setTreeState(source.tree);
      setTableState(source.table);
    }
  }, []);

  const setTree = useCallback(
    (next: TreeRow[]) => {
      const data = JSON.parse(JSON.stringify(next)) as TreeRow[];
      setTreeState(data);
      storageSave(state.userName, state.userPass, data, bool(!!data.length, dataTable, []));
    },
    [dataTable, state.userName, state.userPass]
  );

  const setTable = useCallback(
    (data: UserTable[]) => {
      setTableState(data);
      storageSave(state.userName, state.userPass, dataTree, data);
    },
    [dataTree, state.userName, state.userPass]
  );

  const dropAll = useCallback(() => {
    setTableState([]);
    setTreeState([]);
    storageSave(state.userName, state.userPass, [], []);
  }, [state.userName, state.userPass]);

  const logout = useCallback(() => {
    setState(initState());
    setTreeState([]);
    setTableState([]);
    currentUserDrop();
  }, []);

  useEffect(() => {
    const saved = currentUserLoad();
    if (saved.length == 2) {
      login(saved[0], saved[1]);
    }
  }, [login]);

  return (
    <AuthContext.Provider
      value={{ login, logout, setTree, dataTree, dataTable, setTable, dropAll, ...state }}
    >
      {children}
    </AuthContext.Provider>
  );
}
