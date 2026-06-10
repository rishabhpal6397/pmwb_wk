import React, { useState, useEffect, useRef } from 'react';

const EditableCell = ({ value, type, options, onSave, onCancel }) => {
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSave(editValue);
    if (e.key === 'Escape') onCancel();
  };
  const handleBlur = () => onSave(editValue);

  if (type === 'select') {
    return (
      <select
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full p-1 border border-gray-300 rounded"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
  if (type === 'date') {
    return (
      <input
        ref={inputRef}
        type="date"
        value={editValue || ''}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full p-1 border border-gray-300 rounded"
      />
    );
  }
  if (type === 'number') {
    return (
      <input
        ref={inputRef}
        type="number"
        value={editValue}
        onChange={(e) => setEditValue(e.target.valueAsNumber)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full p-1 border border-gray-300 rounded"
      />
    );
  }
  return (
    <input
      ref={inputRef}
      type="text"
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="w-full p-1 border border-gray-300 rounded"
    />
  );
};

export default EditableCell;