import { useState, useEffect } from 'react';
import { 
    Product, 
    User, 
    Order, 
    getProducts, 
    getCurrentUser, 
    getOrders, 
    subscribeToProducts, 
    subscribeToAuth, 
    subscribeToOrders,
    isAuthenticated,
    isAdmin
} from './store';

export function useProducts() {
    const [products, setProducts] = useState<Product[]>(getProducts());
    
    useEffect(() => {
        subscribeToProducts(() => setProducts([...getProducts()]));
    }, []);

    return products;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(getCurrentUser());
    const [isAuth, setIsAuth] = useState(isAuthenticated());
    const [admin, setAdmin] = useState(isAdmin());

    useEffect(() => {
        subscribeToAuth(() => {
            setUser(getCurrentUser());
            setIsAuth(isAuthenticated());
            setAdmin(isAdmin());
        });
    }, []);

    return { user, isAuth, admin };
}

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>(getOrders());
    
    useEffect(() => {
        subscribeToOrders(() => setOrders([...getOrders()]));
    }, []);

    return orders;
}
