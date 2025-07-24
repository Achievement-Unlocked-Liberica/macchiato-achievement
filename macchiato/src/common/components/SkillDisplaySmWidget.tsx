/**
 * SkillDisplaySmWidget Component
 * 
 * Displays skills in a compact hexagon pattern without text labels.
 * Shows solid color for selected skills and border color for unselected skills.
 * Designed for display-only purposes in achievement items.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SKILLS, SkillConfig } from '../constants/skillsConstants';

interface SkillDisplaySmWidgetProps {
  selectedSkills: string[];
}

export const SkillDisplaySmWidget: React.FC<SkillDisplaySmWidgetProps> = ({ selectedSkills }) => {
  const renderSkillCircle = (skill: SkillConfig, style: any) => {
    const isSelected = selectedSkills.includes(skill.id);
    
    return (
      <View
        key={skill.id}
        style={[
          styles.skillCircle,
          {
            borderColor: skill.color,
            backgroundColor: isSelected ? skill.color : 'transparent',
          },
          style,
        ]}
      />
    );
  };

  // Small hexagon layout - much smaller than the selection widget
  const hexagonSize = 48; // Total container size
  const circleSize = 12; // Individual circle size (increased from 6px to 8px)
  const radius = (hexagonSize - circleSize) / 2;
  const centerX = radius;
  const centerY = radius;

  // Calculate hexagon positions (6 vertices + center)
  const positions = [
    // Top (0°) - Strength
    { top: centerY - radius, left: centerX },
    // Top Right (60°) - Constitution
    { top: centerY - radius * Math.cos(Math.PI / 3), left: centerX + radius * Math.sin(Math.PI / 3) },
    // Bottom Right (120°) - Intelligence
    { top: centerY + radius * Math.cos(Math.PI / 3), left: centerX + radius * Math.sin(Math.PI / 3) },
    // Bottom (180°) - Charisma
    { top: centerY + radius, left: centerX },
    // Bottom Left (240°) - Wisdom
    { top: centerY + radius * Math.cos(Math.PI / 3), left: centerX - radius * Math.sin(Math.PI / 3) },
    // Top Left (300°) - Dexterity
    { top: centerY - radius * Math.cos(Math.PI / 3), left: centerX - radius * Math.sin(Math.PI / 3) },
    // Center - Luck
    { top: centerY, left: centerX },
  ];

  // Reorder skills to match the desired hexagon layout:
  // Top: Str, Top Right: Con, Bottom Right: Int, Bottom: Cha, Bottom Left: Wis, Top Left: Dex, Center: Luc
  const skillsInHexagonOrder = [
    SKILLS.find(s => s.id === 'str')!, // Top: Strength
    SKILLS.find(s => s.id === 'con')!, // Top Right: Constitution  
    SKILLS.find(s => s.id === 'int')!, // Bottom Right: Intelligence
    SKILLS.find(s => s.id === 'cha')!, // Bottom: Charisma
    SKILLS.find(s => s.id === 'wis')!, // Bottom Left: Wisdom
    SKILLS.find(s => s.id === 'dex')!, // Top Left: Dexterity
    SKILLS.find(s => s.id === 'luc')!, // Center: Luck
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.hexagonContainer, { width: hexagonSize, height: hexagonSize }]}>
        {skillsInHexagonOrder.map((skill, index) => 
          renderSkillCircle(skill, {
            position: 'absolute',
            top: positions[index].top,
            left: positions[index].left,
          })
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexagonContainer: {
    position: 'relative',
  },
  skillCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
});

export default SkillDisplaySmWidget;
