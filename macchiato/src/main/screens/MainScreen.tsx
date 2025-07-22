import React, { useEffect } from 'react';
import { LayoutWrapper } from '../../common/components/LayoutWrapper';
import { useLayout } from '../../common/context';
import MainContentComponent from '../components/MainContentComponent';
import MainFooterComponent from '../components/MainFooterComponent';

export default function MainScreen() {
  const { updateLayout } = useLayout();

  useEffect(() => {
    // Configure layout for main screen
    updateLayout({
      header: { 
        visible: true, 
        showLogo: true, 
        showProfile: true,
        customTitle: 'A. Unlocked'
      },
    });
  }, [updateLayout]);

  return (
    <LayoutWrapper footer={<MainFooterComponent showMainActions={true} />}>
      <MainContentComponent />
    </LayoutWrapper>
  );
}
