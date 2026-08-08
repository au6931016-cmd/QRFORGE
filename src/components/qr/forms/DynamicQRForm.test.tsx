import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DynamicQRForm } from "@/components/qr/forms/DynamicQRForm";

describe("DynamicQRForm", () => {
  it("renders the field configured for the url type", () => {
    render(<DynamicQRForm type="url" data={{ url: "" }} errors={{}} onChange={() => {}} />);
    expect(screen.getByLabelText(/Website URL/)).toBeInTheDocument();
  });

  it("calls onChange when a field is edited", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DynamicQRForm type="url" data={{ url: "" }} errors={{}} onChange={onChange} />);

    await user.type(screen.getByLabelText(/Website URL/), "e");

    expect(onChange).toHaveBeenCalledWith("url", "e");
  });

  it("shows a field error when provided", () => {
    render(
      <DynamicQRForm
        type="url"
        data={{ url: "bad" }}
        errors={{ url: "Enter a valid URL" }}
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid URL");
  });

  it("conditionally hides the Wi-Fi password field when encryption is nopass", () => {
    render(
      <DynamicQRForm
        type="wifi"
        data={{ ssid: "", password: "", encryption: "nopass", hidden: false }}
        errors={{}}
        onChange={() => {}}
      />,
    );
    expect(screen.queryByLabelText(/Password/)).not.toBeInTheDocument();
  });
});
