import { Link, Outlet, useMatches } from "react-router-dom";
import router from "./router";
import { bool, getHandle } from "./utils";
import styles from "./layout.module.css";
import { useEffect } from "react";
import classNames from "classnames";
import { useAuth } from "./auth";

export default function Layout() {
  const { isAuthenticated } = useAuth();
  const ids = useMatches();
  const currentId = ids[1].id;

  const currentTitle = getHandle(ids[ids.length - 1]).linkText;

  useEffect(() => {
    document.title = currentTitle;
  }, [currentTitle]);

  return (
    <div>
      <nav>
        <ul className={styles.menu}>
          {router.routes[0]
            .children!.filter((r) =>
              bool(isAuthenticated, !getHandle(r).login, !getHandle(r).protected)
            )
            .map((route) => (
              <li
                key={route.path}
                className={classNames(
                  styles.item,
                  route.id === currentId ? styles.current : void 0
                )}
              >
                <Link to={route.path!}>{getHandle(route).linkText}</Link>
              </li>
            ))}
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
