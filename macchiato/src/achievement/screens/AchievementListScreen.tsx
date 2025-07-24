/**
 * Achievement List Screen
 * 
 * Main screen for displaying the latest achievements list
 * with navigation header and proper layout structure
 */

import React, { useEffect } from 'react';
import { LayoutWrapper } from '../../common/components/LayoutWrapper';
import { useLayout } from '../../common/context';
import AchievementListComponent from '../components/AchievementListComponent';

const AchievementListScreen: React.FC = () => {
  const { updateLayout } = useLayout();

  useEffect(() => {
    // Configure layout for achievement list screen
    updateLayout({
      header: {
        visible: true,
        showLogo: true,
        showProfile: true,
        customTitle: 'Latest Achievements',
      },
    });
  }, [updateLayout]);

  const handleError = (error: string) => {
    console.error('Achievement List Error:', error);
    // In a real app, you might want to show a toast or alert here
  };

  return (
    <LayoutWrapper>
      <AchievementListComponent onError={handleError} />
    </LayoutWrapper>
  );
};

export default AchievementListScreen;
