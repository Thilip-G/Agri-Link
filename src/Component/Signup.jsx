// src/components/SignUp.js
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email,
        role,
        createdAt: new Date(),
      });

      navigate('/dashboard'); // or home page
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" required className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" required className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
            <option value="customer">Customer</option>
            <option value="farmer">Farmer</option>
          </select>
        </div>
        <button type="submit" className="btn btn-success">Sign Up</button>
      </form>
      <p className="mt-3">
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
};

export default SignUp;
