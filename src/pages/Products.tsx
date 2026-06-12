import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { deleteProduct, isAdmin } from '../lib/store';
import { useProducts, useAuth } from '../lib/hooks';
import { Search, SlidersHorizontal, Edit2, Trash2, Plus, LayoutGrid, List, CheckCircle2 } from 'lucide-react';
import { useCart } from '../components/CartProvider';
import { motion, AnimatePresence } from 'motion/react';

export default function Products() {
    const products = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sort, setSort] = useState('newest');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const { isAuth, admin } = useAuth();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await deleteProduct(id);
            setShowDeleteSuccess(true);
            setTimeout(() => setShowDeleteSuccess(false), 2000);
        } catch (err: any) {
            console.error('Failed to delete product', err);
            const errDiv = document.createElement('div');
            errDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 text-sm font-medium animate-bounce';
            errDiv.innerText = err.message || 'Failed to delete product';
            document.body.appendChild(errDiv);
            setTimeout(() => errDiv.remove(), 4000);
        }
    };

    let filtered = products.filter(p => 
        (categoryFilter === 'All' || p.category === categoryFilter || (!p.category && categoryFilter === 'Uncategorized')) &&
        (searchTerm === '' || 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.id.toString().includes(searchTerm.toLowerCase()))
    );

    const categories = ['All', ...Array.from(new Set(products.map(p => p.category || 'Uncategorized')))];

    let sortedProducts = [...filtered].sort((a, b) => {
        switch (sort) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'name':
                return a.name.localeCompare(b.name);
            case 'newest':
            default:
                // Now id is string, fallback to sorting by createdAt or just let them stay as is
                return a.id.localeCompare(b.id);
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-200 relative">
            <AnimatePresence>
                {showDeleteSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-10 flex flex-col items-center justify-center shadow-2xl border border-gray-100 dark:border-gray-800">
                            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4 mb-4">
                                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Product Deleted</h2>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">The product has been successfully removed from the store.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <Navigation />
            
            <main className="flex-1">
                <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">Complete Collection</h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                            Browse our full catalog of premium goods. Thoughtfully designed and masterfully crafted.
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                    {/* Controls Row */}
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">
                        <div className="relative w-full md:max-w-md">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full rounded-full border-0 py-3 pl-11 px-6 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm sm:leading-6 bg-white dark:bg-gray-800"
                                placeholder="Search products by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="block w-full sm:w-40 rounded-full border-0 py-2.5 px-4 pr-10 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm sm:leading-6 bg-white dark:bg-gray-800 active:scale-95"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap sr-only sm:not-sr-only">
                                <SlidersHorizontal className="h-4 w-4" />
                                <span>Sort by:</span>
                            </div>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="block w-full sm:w-48 rounded-full border-0 py-2.5 px-4 pr-10 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm sm:leading-6 bg-white dark:bg-gray-800 active:scale-95"
                            >
                                <option value="newest">Newest Arrivals</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name">Name: A to Z</option>
                            </select>

                            <div className="hidden md:flex items-center gap-1 bg-white dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700 shadow-sm">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
                                    aria-label="Grid view"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-full transition-colors ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
                                    aria-label="List view"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {admin && (
                        <div className="mb-8 flex justify-end">
                            <Link to="/admin/add" className="inline-flex items-center gap-2 rounded-full bg-black dark:bg-white px-6 py-2.5 text-sm font-semibold text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm active:scale-95">
                                <Plus className="h-4 w-4" />
                                Post New Product
                            </Link>
                        </div>
                    )}

                    {/* Product Grid */}
                    {sortedProducts.length > 0 ? (
                        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "flex flex-col gap-6 max-w-4xl mx-auto"}>
                            {sortedProducts.map(product => {
                                const inStock = product.stock > 0;
                                return (
                                    <div key={product.id} className={`group relative flex bg-white dark:bg-gray-900 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl dark:hover:shadow-white/5 transition-all duration-300 ${viewMode === 'list' ? 'flex-row h-48 sm:h-64' : 'flex-col'}`}>
                                        <div className={`${viewMode === 'list' ? 'w-48 sm:w-64 h-full flex-shrink-0' : 'aspect-square'} p-6 flex items-center justify-center bg-gray-50 dark:bg-gray-800 overflow-hidden relative`}>
                                        <Link 
                                            to={`/product/${product.id}`}
                                            className="block h-full w-full"
                                        >
                                            <img 
                                                src={product.image} 
                                                alt={product.name} 
                                                className={`h-full w-full object-contain object-center transition-transform duration-700 group-hover:scale-105 ${!inStock ? 'opacity-50 grayscale' : ''}`}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = `https://placehold.co/400x500?text=${encodeURIComponent(product.name)}`;
                                                }}
                                            />
                                        </Link>
                                        {!inStock && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="bg-white/90 dark:bg-black/80 backdrop-blur-sm text-black dark:text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">Sold Out</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className={`p-4 md:p-6 flex-1 flex flex-col justify-between`}>
                                            <div>
                                                <div className="flex justify-between items-start gap-4 mb-2">
                                                    <h3 className={`${viewMode === 'list' ? 'text-lg md:text-xl' : 'text-base'} font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2`}>
                                                        <Link to={`/product/${product.id}`} className="hover:underline">
                                                            {product.name}
                                                        </Link>
                                                    </h3>
                                                    <p className={`font-medium text-gray-900 dark:text-white ${viewMode === 'list' ? 'text-lg md:text-xl' : 'text-base'}`}><span className="text-[1.2em] font-medium mr-[1px] inline-block -translate-y-[0.05em]">৳</span>{product.price.toFixed(2)}</p>
                                                </div>
                                                <div className="mb-2">
                                                    <span className="inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 ring-1 ring-inset ring-gray-500/10 dark:ring-white/10">
                                                        {product.category || 'Uncategorized'}
                                                    </span>
                                                </div>
                                                {viewMode === 'list' && product.description && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 line-clamp-2 hidden sm:block">
                                                        {product.description}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <div className="mt-auto pt-4 flex flex-col gap-3 justify-end h-full">
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Stock: {product.stock} units</p>
                                                <div className={`flex flex-col ${viewMode === 'list' ? 'sm:flex-row' : ''} gap-3 mt-1`}>
                                                    <button 
                                                        onClick={() => {
                                                            addToCart(product);
                                                            navigate('/cart');
                                                        }}
                                                        disabled={!inStock}
                                                        className="w-full flex justify-center items-center gap-2 rounded-full bg-black dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-95"
                                                    >
                                                        {inStock ? "Shop Now" : "Out of Stock"}
                                                    </button>

                                                    {admin && (
                                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                                            <Link to={`/admin/edit/${product.id}`} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 active:scale-95">
                                                                <Edit2 className="h-4 w-4" />
                                                                <span>Edit</span>
                                                            </Link>
                                                            <button onClick={(e) => handleDelete(e, product.id)} className="inline-flex items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10 p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                            <Search className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">No products found</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">We couldn't find anything matching "{searchTerm}".</p>
                            <button onClick={() => setSearchTerm('')} className="mt-6 inline-flex items-center rounded-full bg-white dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors active:scale-95">
                                Clear search
                            </button>
                        </div>
                    )}
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
