import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import '../css/InputField.css';

interface InputFieldProps {
  icon: IconDefinition;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ icon, type, placeholder, value, onChange }) => {
  return (
    <div className="input-container">
      <FontAwesomeIcon icon={icon} className="icon" />
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} className="input-field" />
    </div>
  );
}

export default InputField;
