
import React, { useState } from 'react';

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  rows = 3,
  required = false,
  readOnly = false,
  pattern,
  patternErrorMessage = 'Invalid input format',
  ...props
}) => {
  const [error, setError] = useState('');

  const validate = (val) => {
    if (!pattern) return true;
    if (!required && val === '') return true;
    const regex = new RegExp(pattern);
    return regex.test(val);
  };

  const handleBlur = (e) => {
    const val = e.target.value;
    if (required && !val.trim()) {
      setError(`${label} is required`);
    } else if (pattern && !validate(val)) {
      setError(patternErrorMessage);
    } else {
      setError('');
    }
  };

  const handleChange = (e) => {
    onChange(e);
    const val = e.target.value;
    if (error) {
      if (!required || val.trim()) {
        if (!pattern || validate(val)) setError('');
      }
    }
  };

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        rows={rows}
        readOnly={readOnly}
        className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:ring-blue-500 focus:border-blue-500`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default TextAreaField;