const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type FakeLoginInput = {
  email: string;
  password: string;
  useMfa?: boolean;
  /** Present when `useMfa` is true — not verified in this mock. */
  otp?: string;
};

/**
 * Simulates authentication. Replace with a real API call (e.g. NestJS).
 * Always succeeds after a short delay if fields are non-empty.
 */
export async function fakeLogin(input: FakeLoginInput): Promise<{ ok: true }> {
  await delay(850);
  if (!input.email.trim() || !input.password) {
    throw new Error("Invalid credentials");
  }
  return { ok: true };
}
