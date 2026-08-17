import React, { createContext, useState, ReactNode } from 'react';

type FRAContextType = {
  focusedCourse: string | null;
  setFocusedCourse: (course: string | null) => void;
};

export const FRAContext = createContext<FRAContextType>({
  focusedCourse: null,
  setFocusedCourse: () => {},
});

export const FRAProvider = ({ children }: { children: ReactNode }) => {
  const [focusedCourse, setFocusedCourse] = useState<string | null>(null);
  return (
    <FRAContext.Provider value={{ focusedCourse, setFocusedCourse }}>
      {children}
    </FRAContext.Provider>
  );
};
