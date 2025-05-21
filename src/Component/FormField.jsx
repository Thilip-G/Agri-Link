
import React from 'react';
import WebcamCapture from './WebcamCapture';

const FormInput = ({ type, placeholder, value, onChange }) => {
  return (
    <input
      className="form-control p-3 mb-3 border-success"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

const FormButton = ({ label, type = 'submit' }) => {
  return (
    <button type={type} className="btn btn-success w-100 fw-bold py-3 mt-2">
      {label}
    </button>
  );
};

const FormFields = ({
  isSignUp,
  userType,
  formData,
  onInputChange,
  onCapture,
}) => {
  return (
    <>
      {isSignUp && (
        <>
          <FormInput
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(value) => onInputChange('name', value)}
          />
        </>
      )}
      <FormInput
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(value) => onInputChange('email', value)}
      />
      <FormInput
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(value) => onInputChange('password', value)}
      />

      {isSignUp && userType === 'farmer' && (
        <>
          <FormInput
            type="tel"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={(value) => onInputChange('phoneNumber', value)}
          />
          <FormInput
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(value) => onInputChange('location', value)}
          />
          <FormInput
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={(value) => onInputChange('age', value)}
          />
          <FormInput
            type="date"
            placeholder="Date of Birth"
            value={formData.dateOfBirth}
            onChange={(value) => onInputChange('dateOfBirth', value)}
          />
          <WebcamCapture onCapture={onCapture} />
        </>
      )}

      <FormButton label={isSignUp ? 'Sign Up' : 'Sign In'} />
    </>
  );
};

export default FormFields;

