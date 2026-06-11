import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Product } from '../lib/store';
import { useProducts } from '../lib/hooks';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '../components/CartProvider';

export default function ProductDetails() {
    const { id } = useParams();
    const globalProducts = useProducts();
    const [product, setProduct] = useState<Product | null>(null);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        if (id && globalProducts.length > 0) {
            const foundProduct = globalProducts.find(p => p.id === id);
            setProduct(foundProduct || null);
        }
    }, [id, globalProducts]);

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <p className="text-xl text-gray-500 mb-4">Product not found.</p>
                <Link to="/products" className="text-black hover:underline flex items-center gap-2">
                    <ArrowLeft size={16} /> Return to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors duration-200">
            <Navigation />
            
            <main className="flex-1 py-12 pt-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Link to="/products" className="inline-flex items-center text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white mb-8 transition-colors">
                        <ArrowLeft size={16} className="mr-2" /> Back to Products
                    </Link>

                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                        {/* Product Image */}
                        <div className="mb-10 lg:mb-0">
                            <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-900 border border-black/5 dark:border-white/5 shadow-sm">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-cover object-center"
                                />
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col justify-center">
                            <div className="mb-6">
                                <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-200 mb-4 tracking-wide uppercase">
                                    {product.category}
                                </span>
                                <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                                    {product.name}
                                </h1>
                                <p className="text-3xl tracking-tight text-gray-900 dark:text-white font-medium">
                                    ${product.price.toFixed(2)}
                                </p>
                            </div>

                            <div className="mb-8 border-t border-gray-100 dark:border-gray-800 pt-8">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Description</h3>
                                <div className="prose prose-sm dark:prose-invert text-gray-500 dark:text-gray-400">
                                    {product.description || "A premium quality product thoughtfully designed for modern lifestyles."}
                                </div>
                            </div>

                            <div className="mb-10">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Availability</h3>
                                    <span className={`text-sm ${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                    </span>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        className="flex-1 flex items-center justify-center gap-2 rounded-full bg-white dark:bg-gray-950 px-8 py-4 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                        disabled={product.stock === 0}
                                        onClick={() => addToCart(product)}
                                    >
                                        <ShoppingCart size={18} />
                                        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                                    </button>
                                    <button
                                        className="flex-1 flex items-center justify-center gap-2 rounded-full bg-black dark:bg-white px-8 py-4 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                        disabled={product.stock === 0}
                                        onClick={() => {
                                            addToCart(product);
                                            navigate('/cart');
                                        }}
                                    >
                                        {product.stock > 0 ? "Shop Now" : "Out of Stock"}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
                                        <Truck size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Free Shipping</h4>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">On orders over $100</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">2 Year Warranty</h4>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Full coverage</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
                                        <RotateCcw size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Free Returns</h4>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Within 30 days</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6 mt-auto">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <p className="mt-2">&copy; {new Date().getFullYear()} Mafikul's Store. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
