import type User from "./UserInterface";

export default interface UserContextType {
  name?: User;
  login: (user: User) => void;
  logout: () => void;
}