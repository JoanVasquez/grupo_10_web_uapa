import { render, screen } from "@testing-library/react";
import Badge from "./Badge";

describe("Badge", () => {
  it("shows child content", () => {
    render(
      <Badge count={2}>
        <span>Inbox</span>
      </Badge>
    );

    expect(screen.getByText("Inbox")).toBeInTheDocument();
  });

  it("shows count when greater than zero", () => {
    render(
      <Badge count={2}>
        <span>Mail</span>
      </Badge>
    );

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("hides count when zero", () => {
    render(
      <Badge count={0}>
        <span>Mail</span>
      </Badge>
    );

    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });
});
