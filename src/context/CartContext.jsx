import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        // Try to restore from local storage
        const savedCart = localStorage.getItem('edtech_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('edtech_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (course) => {
        setCart((prevCart) => {
            // Check if already in cart
            if (prevCart.find(item => item.id === course.id)) {
                return prevCart; // Duplicate check
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

    const cartTotal = cart.reduce((total, item) => total + item.price, 0);
    const cartCount = cart.length;

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};
