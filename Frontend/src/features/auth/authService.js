import { saveState, loadState } from "../../utils/localStorage";
import { v4 as uuidv4 } from "uuid";

const register = (userData) => {
  const users = loadState("users") || [];

  const existingUser = users.find((user) => user.email === userData.email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const newUser = {
    id: uuidv4(),
    ...userData,
    isVerified: userData.role === "provider" ? false : true,
    wallet: userData.role === "provider" ? 0 : undefined,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveState("users", users);

  return newUser;
};

const login = (loginData) => {
  const users = loadState("users") || [];

  const user = users.find(
    (u) => u.email === loginData.email && u.password === loginData.password
  );

  if (!user) {
    throw new Error("Invalid credentials");
  }

  saveState("currentUser", user);
  return user;
};

const logout = () => {
  localStorage.removeItem("currentUser");
};

const updateUser = (userData) => {
  const users = loadState("users") || [];
  const updated = users.map((u) => (u.id === userData.id ? { ...u, ...userData } : u));
  saveState("users", updated);
  
  const currentUser = loadState("currentUser");
  if (currentUser && currentUser.id === userData.id) {
    saveState("currentUser", { ...currentUser, ...userData });
  }
  return updated;
};

export default { register, login, logout, updateUser };
