import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { addProduct } from '../lib/store';
import { useAuth } from '../lib/hooks';
import { UploadCloud, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminAdd() {
    const navigate = useNavigate();
    const { admin } = useAuth();
    const [productId, setProductId] = useState('');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [description, setDescription] = useState('');
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    useEffect(() => {
        if (admin === false) {
            navigate('/admin/login');
        }
    }, [navigate, admin]);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result && typeof e.target.result === 'string') {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const max_size = 800;

                    if (width > height && width > max_size) {
                        height *= max_size / width;
                        width = max_size;
                    } else if (height > max_size) {
                        width *= max_size / height;
                        height = max_size;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, width, height);
                        setImagePreview(canvas.toDataURL('image/jpeg', 0.8));
                    }
                };
                img.src = e.target.result;
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await addProduct({
                name,
                category: category || 'Uncategorized',
                price: parseFloat(price),
                stock: parseInt(stock, 10),
                image: imagePreview || `https://placehold.co/400x500?text=${encodeURIComponent(name)}`,
                description: description || undefined
            }, productId || undefined);
            
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setIsSubmitting(false);
                navigate('/admin');
            }, 2000);
        } catch (error: any) {
            console.error('Failed to publish product', error);
            setIsSubmitting(false);
            // Non-blocking fallback
            const errDiv = document.createElement('div');
            errDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 text-sm font-medium animate-bounce';
            errDiv.innerText = error.message || 'Failed to add product';
            document.body.appendChild(errDiv);
            setTimeout(() => errDiv.remove(), 4000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-200 relative">
            <AnimatePresence>
                {showSuccess && (
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
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Product Created</h2>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">Your new product has been successfully published to the store.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <Navigation />
            
            <main className="flex-1 py-12">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Add New Product</h1>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Expand your catalog with a new premium item.</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 px-6 py-8 shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10 sm:rounded-xl sm:px-12 border-0 dark:border border-gray-100 dark:border-gray-800">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
                                        Product Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            id="name"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm sm:leading-6"
                                            placeholder="E.g., Minimalist Desk Lamp"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="productId" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
                                        Custom Product ID (Optional)
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            id="productId"
                                            value={productId}
                                            onChange={(e) => setProductId(e.target.value)}
                                            className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm sm:leading-6"
                                            placeholder="E.g., 1 or P-001"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
                                        Category
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            id="category"
                                            required
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm sm:leading-6"
                                        >
                                            <option value="" disabled>Select a category</option>
                                            <option value="Clothing">Clothing</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Computers">Computers</option>
                                            <option value="Accessories">Accessories</option>
                                            <option value="Audio">Audio</option>
                                            <option value="Wearables">Wearables</option>
                                            <option value="Home">Home</option>
                                            <option value="Kitchen">Kitchen</option>
                                            <option value="Stationery">Stationery</option>
                                            <option value="Apparel">Apparel</option>
                                            <option value="Footwear">Footwear</option>
                                            <option value="Sports">Sports</option>
                                            <option value="Beauty">Beauty</option>
                                            <option value="Health">Health</option>
                                            <option value="Uncategorized">Uncategorized</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
                                        Price (USD)
                                    </label>
                                    <div className="relative mt-2 rounded-md shadow-sm">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span className="text-gray-500 sm:text-sm">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            id="price"
                                            step="0.01"
                                            min="0"
                                            required
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="block w-full rounded-md border-0 py-2 pl-9 pr-3 text-gray-900 dark:text-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm sm:leading-6"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="stock" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
                                        Stock Quantity
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="number"
                                            id="stock"
                                            min="0"
                                            required
                                            value={stock}
                                            onChange={(e) => setStock(e.target.value)}
                                            className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm sm:leading-6"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
                                    Description (Optional)
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        id="description"
                                        rows={3}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm sm:leading-6"
                                        placeholder="Detailed description of the product..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
                                    Product Image
                                </label>
                                <div 
                                    className={`mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10 transition-colors ${isDragging ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-800' : 'border-gray-900/25 dark:border-gray-700 bg-white dark:bg-gray-900'}`}
                                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={e => { e.preventDefault(); setIsDragging(false); }}
                                    onDrop={e => {
                                        e.preventDefault();
                                        setIsDragging(false);
                                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                            handleFile(e.dataTransfer.files[0]);
                                        }
                                    }}
                                >
                                    <div className="text-center">
                                        {imagePreview ? (
                                            <div className="mx-auto flex justify-center">
                                                <img src={imagePreview} alt="Preview" className="h-64 object-cover rounded-md" />
                                            </div>
                                        ) : (
                                            <ImageIcon className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" aria-hidden="true" />
                                        )}
                                        <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400 justify-center">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded-md bg-transparent font-semibold text-black dark:text-white focus-within:outline-none hover:underline"
                                            >
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
                                                }} />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs leading-5 text-gray-500">PNG, JPG, WebP up to 10MB</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-x-6 border-t border-gray-900/10 dark:border-white/10">
                                <button type="button" onClick={() => navigate('/admin')} className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="rounded-md bg-black dark:bg-white px-8 py-2.5 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Publishing...' : 'Publish Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
