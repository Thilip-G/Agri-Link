import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

const Navbar = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm rounded">
      <div className="container">
        <NavLink className="navbar-brand fw-bold text-success" to="/">Agri-Link</NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Dashboard</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/products">Products</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/farmers">Farmers</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/orders">Orders</NavLink>
            </li>
            {!user ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link btn btn-danger text-white ms-2" to="/signup">Sign Up</NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="nav-link btn btn-link text-danger" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
