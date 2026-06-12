import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { updateProduct } from '../lib/store';
import { useProducts, useAuth } from '../lib/hooks';
import { Image as ImageIcon } from 'lucide-react';

export default function AdminEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const globalProducts = useProducts();
    const { admin } = useAuth();
    
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [description, setDescription] = useState('');
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (admin === false) {
            navigate('/admin/login');
            return;
        }
        if (id && globalProducts.length > 0) {
            const product = globalProducts.find(p => p.id === id);
            if (product) {
                setName(product.name);
                setCategory(product.category || 'Uncategorized');
                setPrice(product.price.toString());
                setStock(product.stock.toString());
                setDescription(product.description || '');
                setImagePreview(product.image);
            } else {
                navigate('/products');
            }
        }
    }, [id, navigate, admin, globalProducts]);

    const handleFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result && typeof e.target.result === 'string') {
                setImagePreview(e.target.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id) {
            try {
                await updateProduct(id, {
                    name,
                    category: category || 'Uncategorized',
                    price: parseFloat(price),
                    stock: parseInt(stock, 10),
                    image: imagePreview || `https://placehold.co/400x500?text=${encodeURIComponent(name)}`,
                    description: description || undefined
                });
                
                // Show floating success before navigating
                const successDiv = document.createElement('div');
                successDiv.className = 'fixed top-4 right-4 flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 text-sm font-medium';
                successDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Product Updated';
                document.body.appendChild(successDiv);
                setTimeout(() => {
                    successDiv.remove();
                    navigate('/admin');
                }, 1500);

            } catch (err: any) {
                console.error('Failed to update product', err);
                const errDiv = document.createElement('div');
                errDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 text-sm font-medium animate-bounce';
                errDiv.innerText = err.message || 'Failed to update product';
                document.body.appendChild(errDiv);
                setTimeout(() => errDiv.remove(), 4000);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
            <Navigation />
            
            <main className="flex-1 py-12">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Edit Product</h1>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Update product details and inventory.</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 px-6 py-8 shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10 sm:rounded-xl sm:px-12 border-0 dark:border border-gray-100 dark:border-gray-800">
                        <form onSubmit={handleSubmit} className="space-y-8">
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
                                <button type="button" onClick={() => navigate('/products')} className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-black dark:bg-white px-8 py-2.5 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
