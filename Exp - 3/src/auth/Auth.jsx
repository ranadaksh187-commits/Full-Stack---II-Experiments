import { createToken } from "../utils/jwt.js";
import { saveToken, removeToken } from "../utils/storage.js";

export const loginUser = (username, role) => {
  const user = {
    username: username,
    role: role,
  };

  const token = createToken(user);

  saveToken(token);

  return true;
};

export const logoutUser = () => {
  removeToken();
};