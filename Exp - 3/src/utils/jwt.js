export const createToken = (user) => {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload = {
    username: user.username,
    role: user.role,
    iat: Date.now(),
  };

  const encodedHeader = btoa(
    JSON.stringify(header)
  );

  const encodedPayload = btoa(
    JSON.stringify(payload)
  );

  const fakeSignature = btoa(
    "post-manager-secret"
  );

  return `${encodedHeader}.${encodedPayload}.${fakeSignature}`;
};

export const decodeToken = (token) => {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(
      atob(parts[1])
    );

    return payload;

  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};