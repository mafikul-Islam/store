import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useCart } from '../components/CartProvider';
import { addOrder, OrderItem } from '../lib/store';
import { useAuth } from '../lib/hooks';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function Checkout() {
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = useState(false);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');

    const { isAuth, user } = useAuth();

    useEffect(() => {
        if (isAuth === false) {
            navigate('/admin/login'); // Redirect to login if user is not authenticated
        } else if (user) {
            setName(user.name);
        }
    }, [isAuth, navigate, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const orderItems: OrderItem[] = cart.map(item => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity
        }));

        const newOrder = {
            id: crypto.randomUUID(), // Note: Or pass undefined and let addOrder return
            userId: user.id,
            userName: name,
            items: orderItems,
            total: cartTotal,
            shippingAddress: `${address}, ${city}, ${zip}`,
            status: 'pending' as const,
            createdAt: Date.now()
        };

        try {
            await addOrder(newOrder);
            clearCart();
            setIsSuccess(true);
        } catch (error: any) {
            alert('Failed to place order: ' + error.message);
        }
    };

    if (!isAuth) {
        return null; // Will redirect via useEffect
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
                <Navigation />
                <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 text-center shadow-lg">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2">Order Confirmed!</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">Thank you for your purchase. We've received your order and will ship it shortly.</p>
                        <Link to="/" className="inline-flex w-full items-center justify-center rounded-full bg-black dark:bg-white px-6 py-3 text-sm font-semibold text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors active:scale-95">
                            Return Home
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
                <Navigation />
                <main className="flex-1 flex flex-col items-center justify-center p-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">You have nothing to checkout.</p>
                    <button onClick={() => navigate('/products')} className="text-black dark:text-white underline font-medium">Go to Shop</button>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
            <Navigation />
            <main className="flex-1 py-12">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>
                    
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Shipping Information</h2>
                                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                                    <div className="sm:col-span-2">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-gray-300">Full Name</label>
                                        <input required type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-black focus:ring-black dark:focus:ring-white sm:text-sm p-2 border" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-900 dark:text-gray-300">Address</label>
                                        <input required type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-black focus:ring-black dark:focus:ring-white sm:text-sm p-2 border" />
                                    </div>
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-900 dark:text-gray-300">City</label>
                                        <input required type="text" id="city" value={city} onChange={e => setCity(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-black focus:ring-black dark:focus:ring-white sm:text-sm p-2 border" />
                                    </div>
                                    <div>
                                        <label htmlFor="zip" className="block text-sm font-medium text-gray-900 dark:text-gray-300">ZIP / Postal Code</label>
                                        <input required type="text" id="zip" value={zip} onChange={e => setZip(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-black focus:ring-black dark:focus:ring-white sm:text-sm p-2 border" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment</h2>
                                <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 mb-4">
                                    <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <AlertCircle className="h-4 w-4" />
                                        This is a demo store. No actual payment is required.
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white mb-6">
                                    <p>Total to Pay</p>
                                    <p><span className="text-[1.2em] font-medium mr-[1px] inline-block -translate-y-[0.05em]">৳</span>{cartTotal.toFixed(2)}</p>
                                </div>
                                <button type="submit" className="w-full flex justify-center rounded-full bg-black dark:bg-white px-4 py-3 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors active:scale-95">
                                    Place Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
