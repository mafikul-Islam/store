import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { registerUser } from '../lib/store';
import { User, Lock, Mail } from 'lucide-react';

export default function Register() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await registerUser(name, username, email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Registration failed.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
            <Navigation />
            
            <main className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="mx-auto h-12 w-12 bg-black dark:bg-white rounded-xl flex items-center justify-center">
                        <User className="h-6 w-6 text-white dark:text-black" />
                    </div>
                    <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
                        Create an account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                        Already have an account? <Link to="/admin/login" className="font-semibold leading-6 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 underline">Sign in</Link>
                    </p>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                    <div className="bg-white dark:bg-gray-900 px-6 py-12 shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10 sm:rounded-xl sm:px-12">
                        {error && (
                            <div className="rounded-md bg-red-50 dark:bg-red-500/10 p-4 mb-6">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800 dark:text-red-400">{error}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
                                    Full Name
                                </label>
                                <div className="mt-2 relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 py-2 pl-10 px-3 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm border focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
                                    Username
                                </label>
                                <div className="mt-2 relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 py-2 pl-10 px-3 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm border focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Choose a unique username"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
                                    Email Address
                                </label>
                                <div className="mt-2 relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 py-2 pl-10 px-3 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm border focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email address"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
                                    Password
                                </label>
                                <div className="mt-2 relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 py-2 pl-10 px-3 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm border focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full justify-center rounded-md bg-black dark:bg-white px-3 py-2.5 text-sm font-semibold leading-6 text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 active:scale-95"
                                >
                                    {loading ? 'Creating...' : 'Create account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
