import { render, screen } from "@testing-library/react";
import RepositoriesSummary from "./RepositoriesSummary";

test("displays information about the repository", () => {
  const repository = {
    stargazers_count: 5,
    open_issues: 12,
    forks: 30,
    language: "Javascript",
  };

  render(<RepositoriesSummary repository={repository} />);

  for (let key in repository) {
    let value = repository[key];
    const element = screen.getByText(new RegExp(value));
    expect(element).toBeInTheDocument();
  }
});
