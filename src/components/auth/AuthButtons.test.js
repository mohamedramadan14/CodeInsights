import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "../../test/sever";
import AuthButtons from "./AuthButtons";
import { SWRConfig } from "swr";

const renderComponent = async () => {
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter>
        <AuthButtons />
      </MemoryRouter>
    </SWRConfig>
  );
  await screen.findAllByRole("link");
};

describe("When user is not sign in", () => {
  createServer([
    {
      path: "/api/user",
      res: () => {
        return { user: null };
      },
    },
  ]);

  // createServer --> Get '/api/user' --> {user: null}
  test("sign in and sign up are visible", async () => {
    await renderComponent();
    const signInButton = screen.getByRole("link", { name: /sign in/i });
    const signUpButton = screen.getByRole("link", { name: /sign up/i });
    expect(signInButton).toBeInTheDocument();
    expect(signInButton).toHaveAttribute("href", "/signin");
    expect(signUpButton).toBeInTheDocument();
    expect(signUpButton).toHaveAttribute("href", "/signup");
  });

  test("sign out is not visible", async () => {
    await renderComponent();
    const signOutButton = screen.queryByRole("link", { name: /sign out/i });
    expect(signOutButton).not.toBeInTheDocument();
  });
});

describe("When user is signed in", () => {
  createServer([
    {
      path: "/api/user",
      res: () => {
        return { user: { id: 3, email: "hi@hi.com" } };
      },
    },
  ]);

  // cerateServer --> Get 'api/user' --> { user: { id : [number] , email: [email] }}
  test("user signed out is visible", async () => {
    await renderComponent();
    const signOutButton = screen.queryByRole("link", {
      name: /sign out/i,
    });
    expect(signOutButton).toBeInTheDocument();
    expect(signOutButton).toHaveAttribute("href", "/signout");
  });

  test("user sign in and sign up aren't visible", async () => {
    await renderComponent();
    const signInButton = screen.queryByRole("link", {
      name: /sign in/i,
    });
    const signUpButton = screen.queryByRole("link", {
      name: /sign up/i,
    });
    expect(signInButton).not.toBeInTheDocument();
    expect(signUpButton).not.toBeInTheDocument();
  });
});
