import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QRTypeSelector } from "@/components/qr/QRTypeSelector";

describe("QRTypeSelector", () => {
  it("renders a radio button for every QR type", () => {
    render(<QRTypeSelector value="url" onChange={() => {}} />);
    expect(screen.getAllByRole("radio")).toHaveLength(9);
  });

  it("marks the current type as checked", () => {
    render(<QRTypeSelector value="wifi" onChange={() => {}} />);
    expect(screen.getByRole("radio", { name: "Wi-Fi" })).toHaveAttribute("aria-checked", "true");
  });

  it("calls onChange with the clicked type", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QRTypeSelector value="url" onChange={onChange} />);

    await user.click(screen.getByRole("radio", { name: "vCard" }));

    expect(onChange).toHaveBeenCalledWith("vcard");
  });
});
