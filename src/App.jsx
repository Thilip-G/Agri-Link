import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./Component/Navbar"
import Farmers from "./Component/Farmer"
import Orders from "./Component/Order"
import Products from './Component/Product';
import Dashboard from "./Component/Dashboard"
import PrivateRoute from './Component/PrivateRoute'

import 'bootstrap/dist/css/bootstrap.min.css';
import AuthForm from './Component/formAuth';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="/farmers"
          element={
            <PrivateRoute>
              <Farmers />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route path="/signup" element={<AuthForm/>} />
      </Routes>
    </Router>
  );
}

export default App;
