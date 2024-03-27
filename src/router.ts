import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import MainPage from "./pages/MainPage";
import { RouteHandle } from "./types";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import TunePage from "./pages/TunePage";
import ReportPage from "./pages/ReportPage";
import NotFoundPage from "./pages/NotFoundPage";
import LogoutPage from "./pages/LogoutPage";

const pathReport = "report";

export function openReport(chart_type: string, d1: string, d2: string) {
  return `/${pathReport}/${chart_type}_${d1}_${d2}`;
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        path: "",
        Component: MainPage,
        handle: { linkText: "Главная" } as RouteHandle
      },
      {
        path: "about",
        Component: AboutPage,
        handle: { linkText: "О проекте" } as RouteHandle
      },
      {
        path: "tune",
        Component: TunePage,
        handle: { linkText: "Настройка", protected: true } as RouteHandle
      },
      {
        path: pathReport,
        Component: ReportPage,
        handle: { linkText: "Отчет", protected: true } as RouteHandle,
        children: [
          {
            index: true,
            path: ":url_param",
            Component: ReportPage,
            handle: { linkText: "Отчет", protected: true } as RouteHandle
          }
        ]
      },
      {
        path: "login",
        Component: LoginPage,
        handle: { linkText: "Авторизация", login: true } as RouteHandle
      },
      {
        path: "logout",
        Component: LogoutPage,
        handle: { linkText: "Выйти", protected: true } as RouteHandle
      }
    ]
  },
  {
    path: "*",
    Component: NotFoundPage
  }
]);

export default router;
