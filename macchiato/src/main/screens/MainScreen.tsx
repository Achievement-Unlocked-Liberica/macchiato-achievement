import React, { useEffect } from 'react';
import { LayoutWrapper } from '../../common/components/LayoutWrapper';
import { useLayout } from '../../common/context';
import MainContentComponent from '../components/MainContentComponent';

export default function MainScreen() {
  const { updateLayout } = useLayout();

  useEffect(() => {
    // Configure layout for main screen
    updateLayout({
      header: { 
        visible: true, 
        showLogo: true, 
        showProfile: true 
      },
      footer: { 
        visible: true, 
        showActions: false 
      },
    });
  }, [updateLayout]);

  return (
    <LayoutWrapper>
      <MainContentComponent />
    </LayoutWrapper>
  );
}
