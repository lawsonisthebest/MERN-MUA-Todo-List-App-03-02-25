import { createContext, useContext, useState } from "react";

// Create Context
const PopupContext = createContext();

// Context Provider
export const PopupProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <PopupContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </PopupContext.Provider>
  );
};

// Hook to use context
export const usePopup = () => useContext(PopupContext);
