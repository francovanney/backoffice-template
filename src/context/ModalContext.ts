import { createContext } from "react";

import { ReactNode } from "react";

export interface ModalContextType {
  openModal: (modal: ReactNode) => void;
  close: () => void;
  current: ReactNode | null;
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);
