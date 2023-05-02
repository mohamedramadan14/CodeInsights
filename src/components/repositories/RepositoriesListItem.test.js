import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RepositoriesListItem from "./RepositoriesListItem";

const renderComponent = () => {
  const repository = {
    full_name: "facebook/react",
    language: "Javascript",
    description: "A JS Library",
    owner: {
      login: "facebook",
    },
    name: "react",
    html_url: "https://github.com/facebook/react",
  };
  render(
    <MemoryRouter>
      <RepositoriesListItem repository={repository} />
    </MemoryRouter>
  );

  return { repository };
};

test("Show a link for repository homepage in github", async () => {
  const { repository } = renderComponent();
  // This is to wait until react handle state updates and data fetching
  await screen.findByRole("img", { name: /Javascript/i });
  const link = screen.getByRole("link", { name: "github repository" });
  expect(link).toHaveAttribute("href", repository.html_url);
});

test("show a fileicon with appropriate icon", async () => {
  const { repository } = renderComponent();
  const icon = await screen.findByRole("img", { name: /Javascript/i });
  expect(icon).toHaveClass("js-icon");
});

test("shows a link to the code editor page", async () => {
  const { repository } = renderComponent();
  await screen.findByRole("img", { name: /Javascript/i });
  const link = await screen.findByRole("link", {
    name: new RegExp(repository.owner.login),
  });
  expect(link).toHaveAttribute("href", `/repositories/${repository.full_name}`);
});
