// Mock JWT generator for academic demonstration

export function generateMockJWT(username, role) {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const roleLevels = {
    student: 1,
    parent: 2,
    teacher: 3,
    management: 4,
  };

  const payload = {
    username,
    role,
    accessLevel: roleLevels[role],
    iat: Date.now(),
    exp: Date.now() + 3600000,
  };

  const encode = (data) =>
    btoa(JSON.stringify(data))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

  const encodedHeader = encode(header);
  const encodedPayload = encode(payload);

  const signature = encode({
    signature: "Mock-Signature-For-Demonstration",
  });

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function decodeJWT(token) {
  try {
    if (!token) return null;

    const payload = token.split(".")[1];

    if (!payload) return null;

    const decoded = JSON.parse(atob(payload));

    // Check token expiration
    if (decoded.exp && decoded.exp < Date.now()) {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
}