import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
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
import ResetPassword from './pages/ResetPassword';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminCourses from './pages/Admin/AdminCourses';
import AdminStudents from './pages/Admin/AdminStudents';
import AdminCurriculum from './pages/Admin/AdminCurriculum';

const MainLayout = ({ children }) => {
    const location = useLocation();
    const { user } = useAuth();

    const isAdminRoute = location.pathname.startsWith('/admin');
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
    const { user } = useAuth();
    const { fetchEnrollments } = useCart();

    // ✅ Fetch enrollments from DB whenever user logs in
    useEffect(() => {
        if (user?.email) {
            fetchEnrollments(user.email);
        }
    }, [user]);

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
                                <Route path="courses/:courseId/curriculum" element={<AdminCurriculum />} />
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

                            {/* E-commerce */}
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                            <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />

                            {/* Support & Auth */}
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/auth" element={<Auth />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/reset-password" element={<ResetPassword />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />

                            {/* Demo */}
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