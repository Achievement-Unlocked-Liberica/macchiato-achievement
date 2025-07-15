/**
 * Layout Context
 * 
 * Provides centralized layout state management for controlling header/footer
 * visibility and content across the entire application.
 */

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface LayoutState {
  header: {
    visible: boolean;
    showLogo: boolean;
    showProfile: boolean;
    customTitle?: string;
  };
}

interface LayoutContextType {
  layoutState: LayoutState;
  updateLayout: (updates: Partial<LayoutState>) => void;
  resetLayout: () => void;
}

const defaultLayoutState: LayoutState = {
  header: {
    visible: true,
    showLogo: true,
    showProfile: true,
  },
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [layoutState, setLayoutState] = useState<LayoutState>(defaultLayoutState);

  const updateLayout = useCallback((updates: Partial<LayoutState>) => {
    setLayoutState(prev => ({
      header: { ...prev.header, ...updates.header },
    }));
  }, []);

  const resetLayout = useCallback(() => {
    setLayoutState(defaultLayoutState);
  }, []);

  return (
    <LayoutContext.Provider value={{
      layoutState,
      updateLayout,
      resetLayout,
    }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
