import { render, screen } from "@testing-library/react";
import Section from "./Section";

describe("Section", () => {
  it("renders title with provided heading level", () => {
    render(
      <Section title="Products" headingLevel={1}>
        <p>Body content</p>
      </Section>
    );

    expect(screen.getByRole("heading", { level: 1, name: "Products" })).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("renders without title", () => {
    render(
      <Section>
        <p>Only children</p>
      </Section>
    );

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByText("Only children")).toBeInTheDocument();
  });
});
