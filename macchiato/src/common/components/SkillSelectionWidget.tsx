/**
 * SkillSelectionWidget Component
 * 
 * Displays 7 circular skill buttons in a hexagon pattern with a center button.
 * Each button represents a different skill (strength, dexterity, constitution, etc.)
 * and can be toggled on/off. Selected skills are tracked in an internal list.
 */

import React, { useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SKILLS, SkillConfig } from '../constants/skillsConstants';

interface SkillSelectionWidgetProps {
  onSkillsChange?: (skills: string[]) => void;
}

export interface SkillSelectionWidgetRef {
  getSelectedSkills: () => string[];
  setSelectedSkills: (skills: string[]) => void;
}

export const SkillSelectionWidget = forwardRef<SkillSelectionWidgetRef, SkillSelectionWidgetProps>(
  ({ onSkillsChange }, ref) => {
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    const handleSkillToggle = useCallback((skillId: string) => {
      setSelectedSkills(prev => {
        const isSelected = prev.includes(skillId);
        const newSkills = isSelected 
          ? prev.filter(id => id !== skillId)
          : [...prev, skillId];
        
        onSkillsChange?.(newSkills);
        return newSkills;
      });
    }, [onSkillsChange]);

    const getSelectedSkills = useCallback(() => selectedSkills, [selectedSkills]);

    const setSelectedSkillsExternal = useCallback((skills: string[]) => {
      setSelectedSkills(skills);
      onSkillsChange?.(skills);
    }, [onSkillsChange]);

    useImperativeHandle(ref, () => ({
      getSelectedSkills,
      setSelectedSkills: setSelectedSkillsExternal,
    }), [getSelectedSkills, setSelectedSkillsExternal]);

    const renderSkillButton = (skill: SkillConfig, style: any) => {
      const isSelected = selectedSkills.includes(skill.id);
      
      return (
        <TouchableOpacity
          key={skill.id}
          style={[
            styles.skillButton,
            {
              borderColor: skill.color,
              backgroundColor: isSelected ? skill.color : 'transparent',
              borderWidth: 2
            },
            style,
          ]}
          onPress={() => handleSkillToggle(skill.id)}
        >
          <Text
            style={[
              styles.skillLabel,
              {
                color: isSelected ? '#FFFFFF' : skill.color,
              },
            ]}
          >
            {skill.label}
          </Text>
        </TouchableOpacity>
      );
    };

    const containerWidth = Dimensions.get('window').width * 0.85; // 75% of screen width
    const hexagonSize = containerWidth * 0.9; // 90% of container width
    const buttonSize = 64; // Standard button size (same as cancel/submit buttons)
    const radius = (hexagonSize - buttonSize) / 2;
    const centerX = radius;
    const centerY = radius;

    // Calculate hexagon positions (6 vertices + center)
    const positions = [
      // Top (0°)
      { top: centerY - radius, left: centerX },
      // Top Right (60°)
      { top: centerY - radius * Math.cos(Math.PI / 3), left: centerX + radius * Math.sin(Math.PI / 3) },
      // Bottom Right (120°)
      { top: centerY + radius * Math.cos(Math.PI / 3), left: centerX + radius * Math.sin(Math.PI / 3) },
      // Bottom (180°)
      { top: centerY + radius, left: centerX },
      // Bottom Left (240°)
      { top: centerY + radius * Math.cos(Math.PI / 3), left: centerX - radius * Math.sin(Math.PI / 3) },
      // Top Left (300°)
      { top: centerY - radius * Math.cos(Math.PI / 3), left: centerX - radius * Math.sin(Math.PI / 3) },
      // Center
      { top: centerY, left: centerX },
    ];

    // Reorder skills to match the desired hexagon layout:
    // Top: St, Top Right: Cs, Bottom Right: In, Bottom: Ch, Bottom Left: Ws, Top Left: Dx, Center: Lc
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
            renderSkillButton(skill, {
              position: 'absolute',
              top: positions[index].top,
              left: positions[index].left,
            })
          )}
        </View>
        
        <Text style={styles.selectedSkillsLabel}>
          Selected: {selectedSkills.join(', ') || 'None'}
        </Text>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  hexagonContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  skillButton: {
    width: 64,
    height: 64,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  skillLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF', // Default text color
  },
  selectedSkillsLabel: {
    fontSize: 12,
    color: '#6B7280', // gray-500
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
