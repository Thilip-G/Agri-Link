import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaShoppingCart, FaBox, FaUserTie } from 'react-icons/fa';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../firebase';  

const Dashboard = () => {
  const [counts, setCounts] = useState({
    products: 0,
    orders: 0,
    farmers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const productsCountSnap = await getCountFromServer(collection(db, 'products'));
        const ordersCountSnap = await getCountFromServer(collection(db, 'orders'));
        const farmersCountSnap = await getCountFromServer(collection(db, 'farmers'));

        setCounts({
          products: productsCountSnap.data().count,
          orders: ordersCountSnap.data().count,
          farmers: farmersCountSnap.data().count,
        });
      } catch (error) {
        console.error("Error fetching counts from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <h3 className="text-success">Loading dashboard data...</h3>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-bold text-success">AgriLink Dashboard</h2>
      <div className="row g-4">
        <DashboardCard
          icon={<FaBox size={30} className="text-white" />}
          label="Products"
          count={counts.products}
          bg="primary"
        />
        <DashboardCard
          icon={<FaShoppingCart size={30} className="text-white" />}
          label="Orders"
          count={counts.orders}
          bg="warning"
        />
        <DashboardCard
          icon={<FaUserTie size={30} className="text-white" />}
          label="Farmers"
          count={counts.farmers}
          bg="success"
        />
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, label, count, bg }) => (
  <div className="col-md-4">
    <div className={`card text-white shadow rounded-4 bg-${bg} h-100`}>
      <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
        <div className="mb-2">{icon}</div>
        <h4 className="card-title fw-semibold">{label}</h4>
        <h2 className="display-5 fw-bold">{count}</h2>
      </div>
    </div>
  </div>
);

export default Dashboard;
