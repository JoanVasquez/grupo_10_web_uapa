import { render } from "@testing-library/react";
import Icons from "./Icons";

describe("Icons", () => {
  it("renders an svg with expected attributes", () => {
    const { container } = render(
      <Icons
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLineCap="round"
        strokeLineJoin="round"
      >
        <circle cx="12" cy="12" r="10" />
      </Icons>
    );

    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();

    if (!svg) return;

    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
  });
});
