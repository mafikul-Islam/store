/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Background from './components/Background';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminAdd from './pages/AdminAdd';
import AdminEdit from './pages/AdminEdit';
import AdminInventory from './pages/AdminInventory';
import AdminOrders from './pages/AdminOrders';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

export default function App() {
  return (
    <BrowserRouter>
      <Background />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminInventory />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/add" element={<AdminAdd />} />
        <Route path="/admin/edit/:id" element={<AdminEdit />} />
      </Routes>
    </BrowserRouter>
  );
}
