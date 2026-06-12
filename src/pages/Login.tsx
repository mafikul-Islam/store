import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { login, loginWithGoogle, isAdmin } from '../lib/store';
import { Lock, Mail } from 'lucide-react';

export default function Login() {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(loginId, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Invalid email/username or password.');
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setLoading(true);
        setError('');
        try {
            await loginWithGoogle();
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Google sign in failed.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-200">
            <Navigation />
            
            <main className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="mx-auto h-12 w-12 bg-black dark:bg-white rounded-xl flex items-center justify-center">
                        <Lock className="h-6 w-6 text-white dark:text-black" />
                    </div>
                    <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                        Or <Link to="/register" className="font-semibold leading-6 text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300">create a new account</Link>
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
                                <label htmlFor="loginId" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
                                    Email or Username
                                </label>
                                <div className="mt-2 relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="loginId"
                                        name="loginId"
                                        type="text"
                                        required
                                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 py-2 pl-10 px-3 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm border focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white sm:text-sm"
                                        value={loginId}
                                        onChange={(e) => setLoginId(e.target.value)}
                                        placeholder="Email or username"
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
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full justify-center rounded-md bg-black dark:bg-white px-3 py-2.5 text-sm font-semibold leading-6 text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Signing in...' : 'Sign in'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                                </div>
                                <div className="relative flex justify-center text-sm font-medium leading-6">
                                    <span className="bg-white dark:bg-gray-900 px-6 text-gray-900 dark:text-gray-300">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    onClick={handleGoogle}
                                    disabled={loading}
                                    className="flex w-full items-center justify-center gap-3 rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:ring-transparent disabled:opacity-50 transition-colors"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                                        <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                                        <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                                        <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                                    </svg>
                                    <span className="text-sm font-semibold leading-6">Google</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
