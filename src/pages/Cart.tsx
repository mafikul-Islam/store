import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useCart } from '../components/CartProvider';
import { Trash2, ArrowRight } from 'lucide-react';

export default function Cart() {
    const { cart, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
            <Navigation />
            <main className="flex-1 py-12">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-8">Your Cart</h1>
                    
                    {cart.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <p className="text-gray-500 dark:text-gray-400 mb-6">Your cart is currently empty.</p>
                            <Link to="/products" className="inline-flex items-center justify-center rounded-full bg-black dark:bg-white px-8 py-3 text-sm font-semibold text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
                            <div className="flow-root">
                                <ul className="-my-6 divide-y divide-gray-200 dark:divide-gray-800">
                                    {cart.map((item) => (
                                        <li key={item.product.id} className="flex py-6">
                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-800">
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>

                                            <div className="ml-4 flex flex-1 flex-col">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                                        <h3>
                                                            <Link to={`/product/${item.product.id}`} className="hover:underline">{item.product.name}</Link>
                                                        </h3>
                                                        <p className="ml-4">${(item.product.price * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.product.category}</p>
                                                </div>
                                                <div className="flex flex-1 items-end justify-between text-sm">
                                                    <p className="text-gray-500 dark:text-gray-400">Qty {item.quantity}</p>

                                                    <div className="flex">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFromCart(item.product.id)}
                                                            className="font-medium text-red-600 hover:text-red-500 dark:text-red-400 flex items-center gap-1"
                                                        >
                                                            <Trash2 size={16} /> Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8">
                                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white mb-4">
                                    <p>Subtotal</p>
                                    <p>${cartTotal.toFixed(2)}</p>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Shipping and taxes calculated at checkout.</p>
                                <div className="mt-6 flex gap-4">
                                    <button
                                        onClick={() => navigate('/checkout')}
                                        className="flex-1 flex items-center justify-center gap-2 rounded-full bg-black dark:bg-white px-6 py-4 text-base font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                                    >
                                        Checkout <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
