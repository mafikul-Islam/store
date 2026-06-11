import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { updateProduct, deleteProduct, Product } from '../lib/store';
import { useProducts, useAuth } from '../lib/hooks';
import { Edit2, Trash2, Plus } from 'lucide-react';

export function AdminTabs() {
    const location = useLocation();
    
    const tabs = [
        { name: 'Inventory', href: '/admin', current: location.pathname === '/admin' || location.pathname.startsWith('/admin/add') || location.pathname.startsWith('/admin/edit') },
        { name: 'Orders', href: '/admin/orders', current: location.pathname === '/admin/orders' },
    ];

    return (
        <div className="border-b border-gray-200 dark:border-gray-800 mb-8">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                    <Link
                        key={tab.name}
                        to={tab.href}
                        className={`
                            whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium
                            ${tab.current
                                ? 'border-black dark:border-white text-black dark:text-white relative top-[1px]'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'
                            }
                        `}
                    >
                        {tab.name}
                    </Link>
                ))}
            </nav>
        </div>
    );
}

export default function AdminInventory() {
    const navigate = useNavigate();
    const globalProducts = useProducts();
    const { isAuth, admin } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (admin === false) {
            navigate('/admin/login');
            return;
        }
        setProducts(globalProducts);
    }, [navigate, admin, globalProducts]);

    const handlePriceChange = (id: string, rawPrice: string) => {
        const newProducts = [...products];
        const index = newProducts.findIndex(p => p.id === id);
        if (index > -1) {
            newProducts[index].price = parseFloat(rawPrice) || 0;
            setProducts(newProducts);
        }
    };

    const handleStockChange = (id: string, rawStock: string) => {
        const newProducts = [...products];
        const index = newProducts.findIndex(p => p.id === id);
        if (index > -1) {
            newProducts[index].stock = parseInt(rawStock, 10) || 0;
            setProducts(newProducts);
        }
    };

    const handleSaveInline = async (product: Product) => {
        try {
            await updateProduct(product.id, {
                name: product.name,
                category: product.category || 'Uncategorized',
                price: product.price,
                stock: product.stock,
                image: product.image
            });
            alert('Product updated successfully!');
        } catch (e) {
            alert('Update failed.');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
            <Navigation />
            <main className="flex-1 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <AdminTabs />
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-2xl font-bold font-serif leading-6 text-gray-900 dark:text-white">Inventory Management</h1>
                            <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
                                A complete list of all products in your store including their name, price, stock, and category.
                            </p>
                        </div>
                        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                            <Link
                                to="/admin/add"
                                className="inline-flex items-center gap-2 rounded-md bg-black dark:bg-white px-3 py-2 text-center text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                            >
                                <Plus className="h-4 w-4" />
                                Add product
                            </Link>
                        </div>
                    </div>
                    
                    <div className="mt-8 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-white/10 sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-800">
                                        <thead className="bg-gray-50 dark:bg-gray-900">
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                                                    ID & Product
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                    Category
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                    Price (USD)
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                    Stock
                                                </th>
                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                    <span className="sr-only">Actions</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                                            {products.map((product) => (
                                                <tr key={product.id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 flex-shrink-0">
                                                                <img className="h-10 w-10 rounded-md object-cover ring-1 ring-gray-900/10 dark:ring-white/10" src={product.image} alt="" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="font-medium text-gray-900 dark:text-white">
                                                                    <Link to={`/admin/edit/${product.id}`} className="hover:underline">{product.name}</Link>
                                                                </div>
                                                                <div className="text-gray-500 dark:text-gray-400">ID: {product.id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 ring-1 ring-inset ring-gray-500/10 dark:ring-white/10 border border-gray-200 dark:border-gray-700">
                                                            {product.category || 'Uncategorized'}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <input 
                                                            type="number" 
                                                            step="0.01"
                                                            value={product.price}
                                                            onChange={(e) => handlePriceChange(product.id, e.target.value)}
                                                            className="block w-24 rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm sm:leading-6"
                                                        />
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <input 
                                                            type="number" 
                                                            value={product.stock}
                                                            onChange={(e) => handleStockChange(product.id, e.target.value)}
                                                            className="block w-20 rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm sm:leading-6"
                                                        />
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <div className="flex items-center justify-end gap-4">
                                                            <button 
                                                                onClick={() => handleSaveInline(product)}
                                                                className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 font-semibold"
                                                            >
                                                                Save
                                                            </button>
                                                            <Link to={`/admin/edit/${product.id}`} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                                                <Edit2 className="h-4 w-4" />
                                                                <span className="sr-only">Edit</span>
                                                            </Link>
                                                            <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                                                                <Trash2 className="h-4 w-4" />
                                                                <span className="sr-only">Delete</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
