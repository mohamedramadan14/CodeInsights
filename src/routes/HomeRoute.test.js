import { render, screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { MemoryRouter } from "react-router-dom";
import HomeRoute from "./HomeRoute";
import { createServer } from "../test/sever";

createServer([
  {
    path: "/api/repositories",
    res: (req) => {
      const [, language] = req.url.searchParams.get("q").split("language:");
      return {
        items: [
          { id: 1, full_name: `${language}_one` },
          { id: 2, full_name: `${language}_two` },
        ],
      };
    },
  },
]);

test("Renders two links for each language", async () => {
  render(
    <MemoryRouter>
      <HomeRoute />
    </MemoryRouter>
  );

  const languages = [
    "javascript",
    "typescript",
    "rust",
    "go",
    "python",
    "java",
  ];

  // Loop over each language and for each language make sure we see two links
  for (let lang of languages) {
    const links = await screen.findAllByRole("link", {
      name: new RegExp(`${lang}_`),
    });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent(`${lang}_one`);
    expect(links[1]).toHaveTextContent(`${lang}_two`);
    expect(links[0]).toHaveAttribute("href", `/repositories/${lang}_one`);
    expect(links[1]).toHaveAttribute("href", `/repositories/${lang}_two`);
  }

  // assert that the link has appropriate full_name
});

const pause = () => new Promise((resolve) => setTimeout(resolve, 1000));
