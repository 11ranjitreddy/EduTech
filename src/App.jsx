import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './layouts/AdminLayout';

// Student Pages
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

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminCourses from './pages/Admin/AdminCourses';
import AdminStudents from './pages/Admin/AdminStudents';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  // If user is admin and on admin route, we don't show Student Navbar/Footer
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Custom hide logic for immersive pages
  const isLearningPage = location.pathname.startsWith('/learning') || location.pathname.startsWith('/learn');
  const showFooter = !isLearningPage && !isAdminRoute;
  const showNavbar = !isAdminRoute;

  return (
    <div className="app-layout">
      {showNavbar && <Navbar />}
      <main className="main-content">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout>
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="revenue" element={<div>Admin Revenue Placeholder</div>} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Student/General Routes */}
      <Route
        path="/*"
        element={
          <MainLayout>
            <Routes>
              {/* Home & Discovery */}
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:id" element={<CourseDetail />} />

              {/* Learning (Protected) */}
              <Route path="/learning/:id" element={<ProtectedRoute><CourseLearning /></ProtectedRoute>} />
              <Route path="/learn/:id" element={<ProtectedRoute><CourseLearningV2 /></ProtectedRoute>} />
              <Route path="/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />

              {/* E-commerce (Protected where needed) */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />

              {/* Support & Auth */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Demo/Helper */}
              <Route path="/demo-learning" element={<CourseLearning />} />
            </Routes>
          </MainLayout>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppRoutes />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
