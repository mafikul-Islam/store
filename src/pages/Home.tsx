import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Product } from '../lib/store';
import { useProducts } from '../lib/hooks';
import { ArrowRight, ShieldCheck, Truck, Lock, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../components/CartProvider';

export default function Home() {
    const products = useProducts();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
            <Navigation />
            
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                {/* Live Background Effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 opacity-50 z-0" />
                    <motion.div 
                        className="absolute w-[600px] h-[600px] rounded-full blur-[100px] z-0 opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen pointer-events-none bg-blue-300 dark:bg-blue-600"
                        animate={{
                            x: mousePosition.x - 300,
                            y: mousePosition.y - 300,
                        }}
                        transition={{ type: "tween", ease: "backOut", duration: 2 }}
                    />
                    <motion.div 
                        className="absolute w-[400px] h-[400px] rounded-full blur-[80px] z-0 opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen pointer-events-none bg-purple-300 dark:bg-purple-600 top-0 right-0"
                        animate={{
                            x: - (mousePosition.x / 4),
                            y: - (mousePosition.y / 4),
                        }}
                        transition={{ type: "tween", ease: "backOut", duration: 3 }}
                    />
                </div>

                <motion.div 
                    className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center text-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.span variants={itemVariants} className="inline-flex items-center rounded-full bg-black/5 dark:bg-white/10 px-3 py-1 text-sm font-medium text-gray-900 dark:text-white ring-1 ring-inset ring-black/10 dark:ring-white/20 mb-8 backdrop-blur-sm">
                        The Premium Experience
                    </motion.span>
                    <motion.h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 max-w-4xl flex flex-wrap justify-center gap-x-3 sm:gap-x-4">
                        {"Curated goods for a modern lifestyle".split(" ").map((word, i) => (
                            <motion.span 
                                key={i}
                                animate={{ opacity: [0, 0, 1, 1, 0] }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    times: [0, i * 0.1, i * 0.1 + 0.05, 0.8, 1]
                                }}
                            >
                                {word}
                            </motion.span>
                        ))}
                    </motion.h1>
                    <motion.p variants={itemVariants} className="mt-4 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mb-10">
                        Discover our handpicked collection of premium products, designed to elevate your everyday routines with uncompromised quality and aesthetics.
                    </motion.p>
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4">
                        <Link to="/products" className="inline-flex items-center justify-center rounded-full bg-black dark:bg-white px-8 py-3.5 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors w-full sm:w-auto">
                            Shop Collection
                        </Link>
                        <a href="#featured" className="inline-flex items-center justify-center rounded-full bg-white dark:bg-gray-950 px-8 py-3.5 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors w-full sm:w-auto backdrop-blur-sm">
                            View Featured
                        </a>
                    </motion.div>
                </motion.div>
            </section>

            {/* Trust Badges */}
            <section className="bg-white dark:bg-gray-900 py-12 border-b border-gray-100 dark:border-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-gray-100 dark:divide-gray-800">
                        <div className="flex flex-col items-center text-center px-4">
                            <ShieldCheck className="h-8 w-8 text-black dark:text-white mb-4 stroke-1" />
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">100% Authentic</h3>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Verified premium goods</p>
                        </div>
                        <div className="flex flex-col items-center text-center px-4">
                            <Truck className="h-8 w-8 text-black dark:text-white mb-4 stroke-1" />
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Fast Shipping</h3>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Express global delivery</p>
                        </div>
                        <div className="flex flex-col items-center text-center px-4">
                            <Lock className="h-8 w-8 text-black dark:text-white mb-4 stroke-1" />
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Secure Payments</h3>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">256-bit encrypted</p>
                        </div>
                        <div className="flex flex-col items-center text-center px-4">
                            <RefreshCcw className="h-8 w-8 text-black dark:text-white mb-4 stroke-1" />
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Easy Returns</h3>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">30-day return policy</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section id="featured" className="py-24 bg-gray-50 dark:bg-gray-950">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="font-serif text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Featured Releases</h2>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">The latest additions to our curated catalog.</p>
                        </div>
                        <Link to="/products" className="group hidden md:flex items-center gap-2 text-sm font-medium text-black dark:text-white hover:opacity-70 transition-opacity">
                            View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {products.slice(0, 4).map(product => {
                            const inStock = product.stock > 0;
                            return (
                                <div key={product.id} className="group relative flex flex-col bg-white dark:bg-gray-900 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl dark:hover:shadow-white/5 transition-all duration-300">
                                    <div className="aspect-[4/5] bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                                        <Link 
                                            to={`/product/${product.id}`}
                                            className="block h-full w-full"
                                        >
                                            <img 
                                                src={product.image} 
                                                alt={product.name} 
                                                className={`h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105 ${!inStock ? 'opacity-50 grayscale' : ''}`}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = `https://placehold.co/400x500?text=${encodeURIComponent(product.name)}`;
                                                }}
                                            />
                                        </Link>
                                        {!inStock && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">Out of Stock</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-1">
                                            <Link to={`/product/${product.id}`} className="hover:underline">
                                                {product.name}
                                            </Link>
                                        </h3>
                                        <div className="mt-1">
                                            <span className="inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300 ring-1 ring-inset ring-gray-500/10 dark:ring-white/10 border border-gray-100 dark:border-gray-700">
                                                {product.category || 'Uncategorized'}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">${product.price.toFixed(2)}</p>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                                            <button 
                                                onClick={() => {
                                                    addToCart(product);
                                                    navigate('/cart');
                                                }}
                                                disabled={!inStock}
                                                className="w-full flex justify-center items-center gap-2 rounded-full bg-black dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {inStock ? "Shop Now" : "Out of Stock"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-12 flex justify-center md:hidden">
                        <Link to="/products" className="inline-flex items-center justify-center rounded-full bg-white dark:bg-gray-900 px-8 py-3 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full">
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="bg-black py-24 mt-auto">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-serif text-3xl font-bold tracking-tight text-white mb-4">Join the Club</h2>
                    <p className="max-w-xl mx-auto text-gray-400 mb-8">
                        Subscribe to our newsletter to receive exclusive offers, early access to new releases, and curated editorial content.
                    </p>
                    <form className="mx-auto max-w-md flex gap-x-4" onSubmit={(e) => e.preventDefault()}>
                        <label htmlFor="email-address" className="sr-only">Email address</label>
                        <input id="email-address" name="email" type="email" autoComplete="email" required className="min-w-0 flex-auto rounded-full border-0 bg-white/5 px-6 py-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6 placeholder:text-gray-500" placeholder="Enter your email" />
                        <button type="submit" className="flex-none rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors">
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
                        <p>&copy; {new Date().getFullYear()} Mafikul's Store. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link to="#" className="hover:text-black dark:hover:text-white transition-colors">Terms of Service</Link>
                            <Link to="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
