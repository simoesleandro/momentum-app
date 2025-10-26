import React from 'react';

interface MuscleGroupIconProps {
  group: string;
  className?: string;
}

const getIconForGroup = (group: string): string => {
  const lowerGroup = group.toLowerCase();

  // Lower body
  if (['quadríceps', 'posteriores', 'glúteos', 'panturrilha', 'adutores', 'pernas'].some(g => lowerGroup.includes(g))) {
    return 'fas fa-person-walking';
  }
  // Back (pulling)
  if (['costas'].some(g => lowerGroup.includes(g))) {
    return 'fas fa-grip-lines-vertical';
  }
  // Chest (pushing)
  if (['peito'].some(g => lowerGroup.includes(g))) {
    return 'fas fa-grip-lines';
  }
  // Shoulders (vertical press)
  if (['ombros'].some(g => lowerGroup.includes(g))) {
    return 'fas fa-arrow-up';
  }
  // Arms
  if (['bíceps', 'tríceps', 'braços'].some(g => lowerGroup.includes(g))) {
    return 'fas fa-hand-fist';
  }

  return 'fas fa-dumbbell'; // Default/fallback
};

const MuscleGroupIcon: React.FC<MuscleGroupIconProps> = ({ group, className = '' }) => {
  const iconClass = getIconForGroup(group);
  return <i className={`${iconClass} ${className}`} title={group} aria-hidden="true"></i>;
};

export default MuscleGroupIcon;