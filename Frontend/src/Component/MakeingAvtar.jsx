import React from 'react';

const COLORS = [
  '#4f46e5', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#6366f1', // Violet
  '#14b8a6', // Teal
  '#f43f5e', // Rose
  '#8b5cf6', // Purple
  '#0ea5e9', // Sky
];

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % COLORS.length);
  return COLORS[index];
}

const MakingAvatar = ({ name = '', size = 40, textColor = '#fff' }) => {
  const getInitials = (name) => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0];
    return parts[0][0] + parts[1][0];
  };

  const bgColor = stringToColor(name);

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: '15%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: size / 2,
        textTransform: 'uppercase',
        userSelect: 'none',
      }}
    >
      {getInitials(name)}
    </div>
  );
};

export default MakingAvatar;
