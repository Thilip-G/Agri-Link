import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

function FarmerList({ user }) {
  const [farmers, setFarmers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [newFarmer, setNewFarmer] = useState({
    name: '',
    location: '',
    age: '',
    phone: '',
    photoURL: '',
    username: '',
  });
  const [uploading, setUploading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true); // NEW

  useEffect(() => {
    console.log('FarmerList received user:', user);
    if (user && user.username && user.role) {
      setNewFarmer(prev => ({ ...prev, username: user.username }));
    }
    setLoadingUser(false);
  }, [user]);


  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const farmersCol = collection(db, 'farmers');
        const farmerSnapshot = await getDocs(farmersCol);
        const farmerList = farmerSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFarmers(farmerList);
      } catch (error) {
        console.error("Error fetching farmers: ", error);
      }
    };

    if (user && user.username && user.role) {
      fetchFarmers();
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `farmers/${file.name}_${Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);

    uploadTask.on('state_changed',
      null,
      (error) => {
        console.error("Upload error:", error);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setNewFarmer(prev => ({ ...prev, photoURL: downloadURL }));
          setUploading(false);
        });
      }
    );
  };

  // Add or update farmer info
  const handleAddOrUpdateFarmer = async () => {
    try {
      if (selectedFarmer) {
        const farmerDocRef = doc(db, 'farmers', selectedFarmer.id);
        await updateDoc(farmerDocRef, newFarmer);

        setFarmers(prev =>
          prev.map(f =>
            f.id === selectedFarmer.id ? { ...f, ...newFarmer } : f
          )
        );
      } else {
        const docRef = await addDoc(collection(db, 'farmers'), newFarmer);
        setFarmers(prev => [...prev, { id: docRef.id, ...newFarmer }]);
      }

      setShowForm(false);
      setSelectedFarmer(null);
      setNewFarmer({
        name: '',
        location: '',
        age: '',
        phone: '',
        photoURL: '',
        username: user?.username || '',
      });
    } catch (error) {
      console.error("Error adding/updating farmer: ", error);
    }
  };

  if (loadingUser) {
    return (
      <div className="container text-center mt-5">
        <p className="text-info">Checking user session...</p>
      </div>
    );
  }

  if (!user || !user.username || !user.role) {
    return (
      <div className="container text-center mt-5">
        <p className="text-danger fw-bold">User not found or not logged in. Please log in to continue.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center text-success fw-bold">Farmers</h2>

      {user.role === 'farmer' && (
        <div className="text-center mb-3">
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) {
                setSelectedFarmer(null);
                setNewFarmer({
                  name: '',
                  location: '',
                  age: '',
                  phone: '',
                  photoURL: '',
                  username: user.username,
                });
              }
            }}
          >
            {showForm ? 'Cancel' : '+ Add Your Farmer Details'}
          </button>
        </div>
      )}

      {showForm && (
        <div className="card p-3 mb-4 shadow">
          <h4>{selectedFarmer ? 'Edit Farmer Info' : 'Add Farmer Info'}</h4>
          <input
            className="form-control mb-2"
            placeholder="Name"
            value={newFarmer.name}
            onChange={(e) => setNewFarmer({ ...newFarmer, name: e.target.value })}
          />
          <input
            className="form-control mb-2"
            placeholder="Location"
            value={newFarmer.location}
            onChange={(e) => setNewFarmer({ ...newFarmer, location: e.target.value })}
          />
          <input
            className="form-control mb-2"
            placeholder="Age"
            type="number"
            value={newFarmer.age}
            onChange={(e) => setNewFarmer({ ...newFarmer, age: e.target.value })}
          />
          <input
            className="form-control mb-2"
            placeholder="Phone"
            value={newFarmer.phone}
            onChange={(e) => setNewFarmer({ ...newFarmer, phone: e.target.value })}
          />
          <input
            className="form-control mb-2"
            type="file"
            onChange={handleFileChange}
          />
          {uploading && <p className="text-info">Uploading photo...</p>}
          {newFarmer.photoURL && (
            <img
              src={newFarmer.photoURL}
              alt="Preview"
              style={{ width: '100%', maxHeight: 200, objectFit: 'cover', marginBottom: '10px' }}
            />
          )}
          <button
            className="btn btn-success"
            onClick={handleAddOrUpdateFarmer}
            disabled={uploading}
          >
            Submit
          </button>
        </div>
      )}

      <div className="row">
        {farmers.map((farmer) => (
          <div key={farmer.id} className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <img
                src={farmer.photoURL || 'https://via.placeholder.com/400x200.png?text=No+Photo'}
                alt="Farmer"
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{farmer.name}</h5>
                <p><strong>Location:</strong> {farmer.location}</p>
                <p><strong>Age:</strong> {farmer.age}</p>
                <p><strong>Phone:</strong> {farmer.phone}</p>

                {user.role === 'farmer' && user.username === farmer.username && (
                  <button
                    className="btn btn-warning"
                    onClick={() => {
                      setSelectedFarmer(farmer);
                      setShowForm(true);
                      setNewFarmer({ ...farmer });
                    }}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FarmerList;
