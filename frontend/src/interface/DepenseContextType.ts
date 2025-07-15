import type { GetListDepenseData } from "./DepenseInterface";

export default interface DepenseContextType {
  depenses:GetListDepenseData
  refreshDepenses: () => Promise<void>;
}