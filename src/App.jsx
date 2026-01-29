import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import CourseLearning from './pages/CourseLearning';
import CourseLearningV2 from './pages/CourseLearningV2';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyCourses from './pages/MyCourses';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  // Hide footer on Learning page to maximize view area
  const showFooter = !location.pathname.startsWith('/learn');

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/learn/:id" element={<ProtectedRoute><CourseLearning /></ProtectedRoute>} />
              <Route path="/learnv2/:id" element={<ProtectedRoute><CourseLearningV2 /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
              <Route path="/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
