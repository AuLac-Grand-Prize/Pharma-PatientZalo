import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services/api", () => ({
  askPharmacist: vi.fn(),
}));

vi.mock("@/services/zalo-auth", () => ({
  isBrowserDevMode: vi.fn(),
}));

import { askPharmacist } from "@/services/api";
import { isBrowserDevMode } from "@/services/zalo-auth";
import { sendQuestion, DEV_PHARMACIST_REPLY } from "@/services/ask-pharmacist";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("sendQuestion (Ask-Pharmacist wiring)", () => {
  it("production mode: calls askPharmacist once and surfaces the mocked content", async () => {
    vi.mocked(isBrowserDevMode).mockReturnValue(false);
    vi.mocked(askPharmacist).mockResolvedValue({ content: "Trả lời từ Gateway" });

    const result = await sendQuestion("Paracetamol uống thế nào?");

    expect(askPharmacist).toHaveBeenCalledTimes(1);
    expect(askPharmacist).toHaveBeenCalledWith("Paracetamol uống thế nào?");
    expect(result).toBe("Trả lời từ Gateway");
  });

  it("dev mode: returns the canned reply and never calls askPharmacist", async () => {
    vi.mocked(isBrowserDevMode).mockReturnValue(true);

    const result = await sendQuestion("Paracetamol uống thế nào?");

    expect(askPharmacist).not.toHaveBeenCalled();
    expect(result).toBe(DEV_PHARMACIST_REPLY);
  });
});
