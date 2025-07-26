/**
 * Skills Constants
 * 
 * Centralized skill configuration including colors, labels, and IDs
 * for use across multiple components throughout the application.
 */

// Skill button sizes configuration for consistent sizing across components
export const SKILL_BUTTON_SIZES = {
  xs: 10,   // Achievement card widget
  sm: 12,  // Current default
  md: 24,  // Achievement details widget
  lg: 36,  // Achievement form
  xl: 48,  // Extra large for special displays
} as const;

// Centralized skill color configuration for easy modification
export const SKILL_COLORS = {
  str: '#C0392B', // Strength
  dex: '#3498DB', // Dexterity
  con: '#E67E22', // Constitution
  wis: '#8E44AD', // Wisdom
  int: '#F1C40F', // Intelligence
  cha: '#D82C8C', // Charisma
  luc: '#2ECC71', // Luck
} as const;

// Skill configuration interface
export interface SkillConfig {
  id: string;
  label: string;
  color: string;
  fullName: string;
}

// Complete skill definitions
export const SKILLS: SkillConfig[] = [
  { id: 'str', label: 'St', color: SKILL_COLORS.str, fullName: 'Strength' },
  { id: 'dex', label: 'Dx', color: SKILL_COLORS.dex, fullName: 'Dexterity' },
  { id: 'con', label: 'Cs', color: SKILL_COLORS.con, fullName: 'Constitution' },
  { id: 'wis', label: 'Ws', color: SKILL_COLORS.wis, fullName: 'Wisdom' },
  { id: 'int', label: 'In', color: SKILL_COLORS.int, fullName: 'Intelligence' },
  { id: 'cha', label: 'Ch', color: SKILL_COLORS.cha, fullName: 'Charisma' },
  { id: 'luc', label: 'Lc', color: SKILL_COLORS.luc, fullName: 'Luck' },
];

// Helper functions
export const getSkillById = (id: string): SkillConfig | undefined => {
  return SKILLS.find(skill => skill.id === id);
};

export const getSkillColor = (id: string): string => {
  const skill = getSkillById(id);
  return skill?.color || '#000000';
};

export const getSkillLabel = (id: string): string => {
  const skill = getSkillById(id);
  return skill?.label || '??';
};

export const getSkillFullName = (id: string): string => {
  const skill = getSkillById(id);
  return skill?.fullName || 'Unknown';
};
