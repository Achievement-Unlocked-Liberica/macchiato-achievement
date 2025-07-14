/**
 * MultiSelectSkills Component
 * 
 * Multi-select dropdown for selecting skills
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AVAILABLE_SKILLS, Skill } from '../models/skills';

interface MultiSelectSkillsProps {
  selectedSkills: string[];
  onSelectionChange: (skillIds: string[]) => void;
  placeholder?: string;
  error?: string;
}

export const MultiSelectSkills: React.FC<MultiSelectSkillsProps> = ({
  selectedSkills,
  onSelectionChange,
  placeholder = 'Select skills...',
  error,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleSkill = (skillId: string) => {
    const isSelected = selectedSkills.includes(skillId);
    let newSelection: string[];
    
    if (isSelected) {
      newSelection = selectedSkills.filter(id => id !== skillId);
    } else {
      newSelection = [...selectedSkills, skillId];
    }
    
    onSelectionChange(newSelection);
  };

  const getSelectedSkillNames = () => {
    return AVAILABLE_SKILLS
      .filter(skill => selectedSkills.includes(skill.id))
      .map(skill => skill.name)
      .join(', ');
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.selector, error && styles.selectorError]}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={[styles.selectorText, selectedSkills.length === 0 && styles.placeholderText]}>
          {selectedSkills.length > 0 ? getSelectedSkillNames() : placeholder}
        </Text>
        <FontAwesomeIcon icon={faChevronDown} size={16} color="#9FB3C8" />
      </TouchableOpacity>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Skills</Text>
            <View style={styles.headerActions}>
              {selectedSkills.length > 0 && (
                <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>Clear All</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                onPress={() => setIsModalVisible(false)}
                style={styles.doneButton}
              >
                <FontAwesomeIcon icon={faCheck} size={16} color="#171717" />
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.skillsList}>
            {AVAILABLE_SKILLS.map((skill) => {
              const isSelected = selectedSkills.includes(skill.id);
              return (
                <TouchableOpacity
                  key={skill.id}
                  style={[styles.skillItem, isSelected && styles.skillItemSelected]}
                  onPress={() => toggleSkill(skill.id)}
                >
                  <View style={styles.skillContent}>
                    <Text style={[styles.skillName, isSelected && styles.skillNameSelected]}>
                      {skill.name}
                    </Text>
                    <Text style={[styles.skillDescription, isSelected && styles.skillDescriptionSelected]}>
                      {skill.description}
                    </Text>
                  </View>
                  {isSelected && (
                    <FontAwesomeIcon icon={faCheck} size={16} color="#F8C825" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#47505A',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#5F6B78',
  },
  selectorError: {
    borderColor: '#EF4444',
  },
  selectorText: {
    color: '#FCFCFC',
    fontSize: 16,
    flex: 1,
  },
  placeholderText: {
    color: '#9FB3C8',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#1E252C',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#2F353C',
    borderBottomWidth: 1,
    borderBottomColor: '#47505A',
  },
  modalTitle: {
    color: '#FCFCFC',
    fontSize: 18,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  clearButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8C825',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },
  doneButtonText: {
    color: '#171717',
    fontSize: 14,
    fontWeight: '600',
  },
  skillsList: {
    flex: 1,
    padding: 16,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2F353C',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#47505A',
  },
  skillItemSelected: {
    backgroundColor: '#47505A',
    borderColor: '#F8C825',
  },
  skillContent: {
    flex: 1,
    marginRight: 12,
  },
  skillName: {
    color: '#FCFCFC',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  skillNameSelected: {
    color: '#F8C825',
  },
  skillDescription: {
    color: '#9FB3C8',
    fontSize: 14,
  },
  skillDescriptionSelected: {
    color: '#FCFCFC',
  },
});
