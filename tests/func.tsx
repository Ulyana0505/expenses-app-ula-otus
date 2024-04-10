import * as React from "react";
import { render } from "@testing-library/react";
import { AuthProvider } from "../src/auth";
import { MemoryRouter } from "react-router-dom";

export async function wait(t = 0) {
  return new Promise((r) => setTimeout(r, t));
}

export const initialPage = "/start";

export function getAppRender(Component: React.ComponentType) {
  return render(
    <AuthProvider>
      <MemoryRouter basename="/" initialEntries={[initialPage]}>
        <Component />
      </MemoryRouter>
    </AuthProvider>
  );
}
