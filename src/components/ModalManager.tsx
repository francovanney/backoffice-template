import { useState, ReactNode } from "react";
import { ModalContext } from "@/context/ModalContext";

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [current, setCurrent] = useState<ReactNode | null>(null);

  const openModal = (modal: ReactNode) => setCurrent(modal);
  const close = () => setCurrent(null);

  return (
    <ModalContext.Provider value={{ openModal, close, current }}>
      {children}
      {current}
    </ModalContext.Provider>
  );
};
