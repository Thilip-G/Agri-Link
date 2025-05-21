
import React, { useState } from 'react';
import FormToggle from './FormToggle';
import UserTypeSelector from './UserTypeSelector';
import FormFields from './FormField';
import { auth, db, storage } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    location: '',
    age: '',
    dateOfBirth: '',
  });
  const [photo, setPhoto] = useState(null);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setUserType('');
    setPhoto(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      location: '',
      age: '',
      dateOfBirth: '',
    });
  };

  const handleUserTypeSelection = (type) => {
    setUserType(type);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCapture = (capturedImage) => {
    setPhoto(capturedImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        let photoURL = '';
        if (userType === 'farmer' && photo) {
          const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
          await uploadString(storageRef, photo, 'data_url');
          photoURL = await getDownloadURL(storageRef);
        }

        await setDoc(doc(db, 'users', user.uid), {
          name: formData.name,
          email: formData.email,
          role: userType,
          phoneNumber: formData.phoneNumber,
          location: formData.location,
          age: formData.age,
          dateOfBirth: formData.dateOfBirth,
          photoURL,
          createdAt: new Date(),
        });

        alert('Sign Up Successful!');
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          alert(`Welcome back, ${userData.name || 'User'}!`);
        } else {
          alert('No user data found.');
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="d-flex justify-content-center align-items-center p-4 min-vh-100" style={{ backgroundColor: '#e8f5e9' }}>
      <div className="container bg-white shadow p-4 rounded-4">
        <FormToggle isSignUp={isSignUp} onToggle={toggleForm} />
        <div className="row">
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            {photo ? (
              <img src={photo} alt="Captured" className="img-fluid rounded-4 border border-success" />
            ) : (
              <div
                className="border border-success rounded-4 d-flex align-items-center justify-content-center text-secondary"
                style={{
                  width: '100%',
                  height: '300px',
                  backgroundColor: '#f1f8e9',
                }}
              >
                <p className="text-center px-3">
                  Farmer's photo will appear here after capturing
                </p>
              </div>
            )}
          </div>
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              {isSignUp && !userType && (
                <UserTypeSelector onSelectUserType={handleUserTypeSelection} />
              )}
              {(!isSignUp || userType) && (
                <FormFields
                  isSignUp={isSignUp}
                  userType={userType}
                  formData={formData}
                  onInputChange={handleInputChange}
                  onCapture={handleCapture}
                />
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthForm;
