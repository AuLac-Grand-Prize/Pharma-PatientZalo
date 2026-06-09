import { askPharmacist } from "@/services/api";
import { isBrowserDevMode } from "@/services/zalo-auth";

/**
 * Canned reply used only in browser dev-mode (running in a desktop browser,
 * outside the Zalo client) so the chat UI is demoable without a live Gateway.
 */
export const DEV_PHARMACIST_REPLY =
  "Paracetamol 500mg dùng cho người lớn: 1 viên/lần, cách 4-6 giờ, tối đa 4 viên/ngày. " +
  "Không phối hợp nhiều thuốc cùng chứa paracetamol để tránh quá liều gây tổn thương gan.";

/**
 * Single call path for the Ask-Pharmacist feature.
 *
 * - In production (inside the Zalo client, `isBrowserDevMode() === false`) this
 *   calls the real Gateway via `askPharmacist` and returns `data.content`.
 * - In browser dev-mode it returns the canned dev reply and never touches the
 *   network, so the UI works without a backend.
 */
export async function sendQuestion(question: string): Promise<string> {
  if (isBrowserDevMode()) {
    return DEV_PHARMACIST_REPLY;
  }
  const data = await askPharmacist(question);
  return data.content;
}
