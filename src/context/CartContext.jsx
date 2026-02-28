import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const ENROLLMENT_URL = 'http://localhost:8082/api/v1/enrollments';

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('edtech_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);

    // ✅ Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('edtech_cart', JSON.stringify(cart));
    }, [cart]);

    // ✅ Fetch real enrollments from DB
    const fetchEnrollments = async (email) => {
        if (!email) return;
        try {
            const response = await fetch(
                `${ENROLLMENT_URL}/my?studentEmail=${email}`
            );
            const data = await response.json();
            const ids = data.map(e => String(e.courseId));
            setEnrolledCourseIds(ids);
        } catch (err) {
            console.error('Failed to fetch enrollments:', err);
        }
    };

    // ✅ Add to cart
    const addToCart = (course) => {
        setCart((prevCart) => {
            // Already in cart
            if (prevCart.find(item => String(item.id) === String(course.id))) {
                return prevCart;
            }
            // Already owned/enrolled
            if (enrolledCourseIds.includes(String(course.id))) {
                return prevCart;
            }
            return [...prevCart, course];
        });
    };

    // ✅ Remove from cart
    const removeFromCart = (courseId) => {
        setCart(prevCart =>
            prevCart.filter(item => String(item.id) !== String(courseId))
        );
    };

    // ✅ Clear cart
    const clearCart = () => setCart([]);

    // ✅ Complete purchase — called after payment
    const completePurchase = () => {
        const newPurchases = cart.map(course => ({
            ...course,
            progress: 0,
            purchasedAt: new Date().toISOString()
        }));

        // ✅ Update enrolled IDs immediately so CourseCard shows "Owned"
        setEnrolledCourseIds(prev => [
            ...prev,
            ...cart.map(c => String(c.id))
        ]);

        // ✅ Clear cart
        setCart([]);
        localStorage.removeItem('edtech_cart');

        return newPurchases;
    };

    // ✅ Update progress
    const updateCourseProgress = async (enrollmentId, progress) => {
        try {
            await fetch(`${ENROLLMENT_URL}/${enrollmentId}/progress`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ progress })
            });
        } catch (err) {
            console.error('Failed to update progress:', err);
        }
    };

    // ✅ Check if course is purchased
    const isCoursePurchased = (courseId) => {
        return enrolledCourseIds.includes(String(courseId));
    };

    const cartTotal = cart.reduce((total, item) => total + item.price, 0);
    const cartCount = cart.length;

    // ✅ purchasedCourses for backward compatibility with CourseCard
    const purchasedCourses = enrolledCourseIds.map(id => ({ id }));

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            cartTotal,
            cartCount,
            purchasedCourses,
            completePurchase,
            updateCourseProgress,
            isCoursePurchased,
            fetchEnrollments,
            enrolledCourseIds
        }}>
            {children}
        </CartContext.Provider>
    );
};