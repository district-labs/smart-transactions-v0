export function splitSignature(signature: string): {
  r: `0x${string}`;
  s: `0x${string}`;
  v: number;
} {
  // Ensure the signature has the correct length
  if (signature.length !== 132) {
    throw new Error("Invalid signature length");
  }

  // Remove the '0x' prefix if it exists
  if (signature.startsWith("0x")) {
    signature = signature.slice(2);
  }

  // Extract r, s, and v components from the signature
  const r = ("0x" + signature.slice(0, 64)) as `0x${string}`;
  const s = ("0x" + signature.slice(64, 128)) as `0x${string}`;
  const v = parseInt("0x" + signature.slice(128, 130), 16);

  return { r, s, v };
}
