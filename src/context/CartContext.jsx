import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        // Try to restore from local storage
        const savedCart = localStorage.getItem('edtech_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [purchasedCourses, setPurchasedCourses] = useState(() => {
        const savedPurchases = localStorage.getItem('edtech_purchased');
        return savedPurchases ? JSON.parse(savedPurchases) : [];
    });

    useEffect(() => {
        localStorage.setItem('edtech_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('edtech_purchased', JSON.stringify(purchasedCourses));
    }, [purchasedCourses]);

    const addToCart = (course) => {
        setCart((prevCart) => {
            // Check if already in cart
            if (prevCart.find(item => item.id === course.id)) {
                return prevCart; // Duplicate check
            }
            // Check if already purchased
            if (purchasedCourses.find(item => item.id === course.id)) {
                return prevCart; // Already purchased
            }
            return [...prevCart, course];
        });
    };

    const removeFromCart = (courseId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== courseId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const completePurchase = () => {
        // Move cart items to purchased courses with initial progress
        const newPurchases = cart.map(course => ({
            ...course,
            progress: 0,
            purchasedAt: new Date().toISOString()
        }));
        setPurchasedCourses(prev => [...prev, ...newPurchases]);

        // Clear the cart
        setCart([]);

        return newPurchases;
    };

    const updateCourseProgress = (courseId, progress) => {
        setPurchasedCourses(prev =>
            prev.map(course =>
                course.id === courseId
                    ? { ...course, progress: Math.min(100, Math.max(0, progress)) }
                    : course
            )
        );
    };

    const isCoursePurchased = (courseId) => {
        return purchasedCourses.some(course => course.id === courseId);
    };

    const cartTotal = cart.reduce((total, item) => total + item.price, 0);
    const cartCount = cart.length;

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
            isCoursePurchased
        }}>
            {children}
        </CartContext.Provider>
    );
};
