import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { updateOrderStatus, Order } from '../lib/store';
import { useAuth, useOrders } from '../lib/hooks';

function AdminTabs() {
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

export default function AdminOrders() {
    const navigate = useNavigate();
    const { admin } = useAuth();
    const orders = useOrders();

    useEffect(() => {
        if (admin === false) {
            navigate('/admin/login');
        }
    }, [navigate, admin]);

    const handleStatusChange = async (orderId: string, status: Order['status']) => {
        try {
            await updateOrderStatus(orderId, status);
        } catch (e) {
            alert('Failed to update order status');
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
                            <h1 className="text-2xl font-bold font-serif leading-6 text-gray-900 dark:text-white">Customer Orders</h1>
                            <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
                                View and manage customer orders and their current status.
                            </p>
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
                                                    Order ID
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                    Customer
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                    Date
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                    Total
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                                            {orders.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="whitespace-nowrap py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                                        No orders found.
                                                    </td>
                                                </tr>
                                            ) : orders.map((order) => (
                                                <tr key={order.id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                                                        #{order.id}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        {order.userName}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-white font-medium">
                                                        ${order.total.toFixed(2)}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                                                            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 dark:text-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-black dark:focus:ring-white sm:text-sm sm:leading-6"
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="shipped">Shipped</option>
                                                            <option value="delivered">Delivered</option>
                                                        </select>
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
