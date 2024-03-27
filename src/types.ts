export type RouteHandle = {
  linkText: string;
  protected: boolean;
  login: boolean;
};

export type Auth = {
  userName: string;
  userPass: string;
  isAuthenticated: boolean;

  login: (userName: string, userPass: string) => void;
  logout: () => void;
  dataTree: TreeRow[];
  setTree: (d: TreeRow[]) => void;
  dataTable: UserTable[];
  setTable: (d: UserTable[]) => void;
  dropAll: () => void;
};

export type UserStorage = {
  key: string;
  tree: TreeRow[];
  table: UserTable[];
};

export type TreeRow = {
  id: string;
  label: string;
  children?: TreeRow[];
};

export type TableRow = {
  id: string;
  value: number;
  children?: TableRow[];
};

export type UserTable = {
  date: string;
  rows: TableRow[];
};
