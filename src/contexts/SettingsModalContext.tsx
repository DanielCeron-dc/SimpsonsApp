import React from 'react';

interface SettingsModalContextValue {
  openSettings: () => void;
}

export const SettingsModalContext = React.createContext<
  SettingsModalContextValue | undefined
>(undefined);

export const useSettingsModal = (): SettingsModalContextValue => {
  const context = React.useContext(SettingsModalContext);

  if (!context) {
    throw new Error('useSettingsModal must be used within SettingsModalContext.Provider');
  }

  return context;
};
