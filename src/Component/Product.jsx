import React, { useState, useEffect, useRef } from 'react';
import {
  collection, getDocs, addDoc, query
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

const ProductList = ({ userType }) => {
  const [products, setProducts] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '', location: '', price: '', quantity: '', image: '', farmerId: ''
  });
  const [capturing, setCapturing] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const productSnapshot = await getDocs(collection(db, 'products'));
      const farmerSnapshot = await getDocs(collection(db, 'farmers'));

      const productsData = productSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      const farmersData = farmerSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      setProducts(productsData);
      setFarmers(farmersData);
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      setCapturing(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Camera access is required to capture image.');
    }
  };

  const handleCaptureImage = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');
    setNewProduct({ ...newProduct, image: imageData });

    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
    }
    setCapturing(false);
  };

  const handleSubmit = async () => {
    try {
      const loggedInFarmerId = localStorage.getItem('farmerId') || 'unknown';
      const imageRef = ref(storage, `productImages/${Date.now()}.png`);
      await uploadString(imageRef, newProduct.image, 'data_url');
      const imageURL = await getDownloadURL(imageRef);

      const productData = {
        ...newProduct,
        image: imageURL,
        farmerId: loggedInFarmerId,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'products'), productData);
      setProducts([...products, productData]);

      setShowAddModal(false);
      setNewProduct({ title: '', location: '', price: '', quantity: '', image: '', farmerId: '' });
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const getFarmerDetails = (farmerId) =>
    farmers.find(f => f.id?.toString() === farmerId?.toString());

  return (
    <div className="container mt-3 position-relative">
      <h1 className='text-center text-success fw-bolder'>Products</h1>
      <div className="row">
        {products.length > 0 ? (
          products.map((product, index) => {
            const farmer = getFarmerDetails(product.farmerId);
            return (
              <div key={index} className="col-md-4 col-sm-6 mb-4">
                <div className="card h-100 shadow-sm">
                  <img src={product.image} alt="Product" className="card-img-top" />
                  <div className="card-body">
                    <h5 className="card-title">{product.title}</h5>
                    <p className="text-secondary">Location: {product.location}</p>
                    <p>Price: Rs. {product.price}</p>
                    {farmer && (
                      <div className="mt-3 border-top pt-2">
                        <p><strong>Farmer:</strong> {farmer.name}</p>
                        <p><strong>Phone:</strong> {farmer.phone}</p>
                        <img src={farmer.photo} alt="Farmer" className="img-fluid rounded" style={{ height: '100px' }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center">No products' details available.</p>
        )}
      </div>

      {userType === 'farmer' && (
        <button className="btn btn-primary position-absolute bottom-0 fs-4 end-0 m-3" onClick={() => setShowAddModal(true)}>+</button>
      )}

      {showAddModal && (
        <div className="modal show d-block">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Product</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowAddModal(false);
                  if (videoStream) videoStream.getTracks().forEach(track => track.stop());
                }}></button>
              </div>
              <div className="modal-body">
                <input type="text" name="title" placeholder="Title" className="form-control mb-2" value={newProduct.title} onChange={handleInputChange} />
                <input type="text" name="location" placeholder="Location" className="form-control mb-2" value={newProduct.location} onChange={handleInputChange} />
                <input type="number" name="price" placeholder="Price" className="form-control mb-2" value={newProduct.price} onChange={handleInputChange} />
                <input type="number" name="quantity" placeholder="Quantity" className="form-control mb-2" value={newProduct.quantity} onChange={handleInputChange} />

                {capturing ? (
                  <>
                    <video ref={videoRef} autoPlay playsInline className="w-100 border rounded mb-2" />
                    <button className="btn btn-danger" onClick={handleCaptureImage}>📸 Capture</button>
                  </>
                ) : (
                  <button className="btn btn-secondary" onClick={handleStartCamera}>📷 Open Camera</button>
                )}

                {newProduct.image && (
                  <img src={newProduct.image} alt="Captured" className="img-fluid mt-3 border rounded" />
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={handleSubmit}>✅ Submit</button>
                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>❌ Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
