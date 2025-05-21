import React from 'react';

const UserTypeSelector = ({ onSelectUserType }) => {
  return (
    <div className="d-flex gap-3 mb-4">
      <button
        className="flex-fill p-3 btn btn-outline-success text-dark rounded-3 fw-bold"
        type="button"
        onClick={() => onSelectUserType('customer')}
      >
        Customer
      </button>
      <button
        className="flex-fill p-3 btn btn-outline-success text-dark rounded-3 fw-bold"
        type="button"
        onClick={() => onSelectUserType('farmer')}
      >
        Farmer
      </button>
    </div>
  );
};

export default UserTypeSelector;
