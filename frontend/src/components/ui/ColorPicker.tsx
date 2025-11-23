import React from 'react';
import './ColorPicker.css';

interface ColorPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  '#6366f1', // Indigo
  '#10b981', // Green
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#14b8a6', // Teal
  '#3b82f6', // Blue
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onChange }) => {
  return (
    <div className="color-picker">
      <label className="color-picker-label">Color</label>
      <div className="color-picker-swatches">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className={`color-swatch ${selectedColor === color ? 'color-swatch-selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            aria-label={`Select color ${color}`}
          />
        ))}
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => onChange(e.target.value)}
          className="color-picker-input"
          aria-label="Custom color picker"
        />
      </div>
    </div>
  );
};
