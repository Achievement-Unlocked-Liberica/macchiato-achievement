/**
 * SkillDisplayWidget Component
 * 
 * Displays skills in a compact hexagon pattern or flat layout without text labels.
 * Shows solid color for selected skills and border color for unselected skills.
 * Designed for display-only purposes in achievement items.
 * Supports configurable sizes: xs, sm, md, lg, xl
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SKILLS, SkillConfig, SKILL_BUTTON_SIZES } from '../constants/skillsConstants';

interface SkillDisplayWidgetProps {
  selectedSkills: string[];
  layout?: 'hexagon' | 'flat';
  size?: keyof typeof SKILL_BUTTON_SIZES;
  containerStyle?: any;
}

export const SkillDisplayWidget: React.FC<SkillDisplayWidgetProps> = ({ 
  selectedSkills, 
  layout = 'hexagon',
  size = 'sm',
  containerStyle
}) => {
  const buttonSize = SKILL_BUTTON_SIZES[size];
  const borderRadius = buttonSize / 2;
  
  const renderSkillCircle = (skill: SkillConfig, style: any) => {
    const isSelected = selectedSkills.includes(skill.id);
    
    return (
      <View
        key={skill.id}
        style={[
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius: borderRadius,
            borderWidth: 1,
            borderColor: skill.color,
            backgroundColor: isSelected ? skill.color : 'transparent',
          },
          style,
        ]}
      />
    );
  };

  // Dynamic hexagon layout based on button size
  const hexagonSize = buttonSize * 4; // Total container size
  const radius = (hexagonSize - buttonSize) / 2;
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

  // Render flat layout - single row of skills
  const renderFlatLayout = () => {
    return (
      <View style={styles.flatContainer}>
        {SKILLS.map((skill) => 
          renderSkillCircle(skill, { 
        marginHorizontal: size === 'sm' ? 2 : size === 'md' ? 4 : size === 'lg' ? 8 : 2 
          })
        )}
      </View>
    );
  };

  // Render hexagon layout
  const renderHexagonLayout = () => {
    return (
      <View style={[styles.hexagonContainer, { width: hexagonSize, height: hexagonSize }]}>
        {skillsInHexagonOrder.map((skill, index) => 
          renderSkillCircle(skill, {
            position: 'absolute',
            top: positions[index].top,
            left: positions[index].left,
          })
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {layout === 'flat' ? renderFlatLayout() : renderHexagonLayout()}
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
  flatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});

export default SkillDisplayWidget;
