import React from 'react';

const FormToggle = ({ isSignUp, onToggle }) => {
  return (
    <div className="d-flex justify-content-between mb-4">
      <button
        className={`fs-5 btn ${isSignUp ? 'btn-success' : 'btn-outline-success'}`}
        onClick={onToggle}
        type="button"
      >
        Sign Up
      </button>
      <button
        className={`fs-5 btn ${!isSignUp ? 'btn-success' : 'btn-outline-success'}`}
        onClick={onToggle}
        type="button"
      >
        Sign In
      </button>
    </div>
  );
};

export default FormToggle;
