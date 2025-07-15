/**
 * Skills Data
 * 
 * Available skills for achievements
 */

export interface Skill {
  id: string;
  name: string;
  description: string;
}

export const AVAILABLE_SKILLS: Skill[] = [
  { id: 'str', name: 'Strength', description: 'Physical power and endurance' },
  { id: 'dex', name: 'Dexterity', description: 'Agility and hand-eye coordination' },
  { id: 'con', name: 'Constitution', description: 'Health and stamina' },
  { id: 'int', name: 'Intelligence', description: 'Learning and reasoning' },
  { id: 'wis', name: 'Wisdom', description: 'Awareness and insight' },
  { id: 'cha', name: 'Charisma', description: 'Force of personality and leadership' },
  { id: 'luc', name: 'Luck', description: 'Success brought by chance rather than one\'s own actions.' }
];
