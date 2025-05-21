import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust path if needed


const OrderCard = ({ order, isSold, onSoldClick, handleShow }) => (
  <div className="col-md-4 col-sm-6 mb-4">
    <div className="card border-0 shadow-lg rounded-4 h-100">
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 className="fw-bold text-primary mb-2">Order ID: {order.id}</h5>
          <p className="mb-1"><strong>👤 Customer:</strong> {order.customerName}</p>
          <p className="mb-1"><strong>📦 Product:</strong> {order.productTitle}</p>
          <p className="mb-1"><strong>🔢 Quantity:</strong> {order.quantity}</p>
          <p className="mb-1">
            <strong>📌 Status:</strong> 
            <span className={`badge ms-2 ${order.status === 'Pending' ? 'bg-warning' : 'bg-success'}`}>
              {order.status}
            </span>
          </p>
        </div>

        <div className="mt-3">
          <button className="btn btn-outline-success w-100 mb-2" onClick={() => handleShow(order)}>
            📍 Track Order
          </button>
          {isSold ? (
            <button className="btn btn-outline-secondary w-100" disabled>✅ Sold Out</button>
          ) : (
            <button className="btn btn-outline-danger w-100" onClick={() => onSoldClick(order.id)}>
              💰 Mark as Sold
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [visibleOrders, setVisibleOrders] = useState([]);
  const [soldOrders, setSoldOrders] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'orders'));
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(fetched);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);


  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('soldOrders')) || {};
    setSoldOrders(stored);
  }, []);


  useEffect(() => {
    const now = Date.now();
    const filtered = orders.filter(order => {
      const soldTime = soldOrders[order.id];
      return !soldTime || (now - soldTime < 3 * 60 * 60 * 1000);
    });
    setVisibleOrders(filtered);
  }, [orders, soldOrders]);

  const handleSold = (orderId) => {
    const updated = { ...soldOrders, [orderId]: Date.now() };
    setSoldOrders(updated);
    localStorage.setItem('soldOrders', JSON.stringify(updated));
  };

  const handleShow = (order) => setSelectedOrder(order);
  const handleClose = () => setSelectedOrder(null);

  return (
    <div className="container py-4">
      <h1 className="text-center text-success fw-bold mb-4">📊 Order Tracking</h1>

      <div className="row">
        {visibleOrders.length > 0 ? (
          visibleOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              isSold={!!soldOrders[order.id]}
              onSoldClick={handleSold}
              handleShow={handleShow}
            />
          ))
        ) : (
          <p className="text-center">No orders available.</p>
        )}
      </div>

      {/* Modal for Order Details */}
      {selectedOrder && (
        <>
          <div className="modal show fade" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content rounded-4">
                <div className="modal-header bg-success text-white rounded-top-4">
                  <h5 className="modal-title">Order #{selectedOrder.id} Details</h5>
                  <button type="button" className="btn-close" onClick={handleClose}></button>
                </div>
                <div className="modal-body">
                  <p><strong>👤 Customer:</strong> {selectedOrder.customerName}</p>
                  <p><strong>📦 Product:</strong> {selectedOrder.productTitle}</p>
                  <p><strong>🔢 Quantity:</strong> {selectedOrder.quantity}</p>
                  <p><strong>📌 Status:</strong> {selectedOrder.status}</p>
                  <p><strong>🚚 Estimated Delivery:</strong> {selectedOrder.estimatedDelivery}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={handleClose}>Close</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default OrderTracking;
