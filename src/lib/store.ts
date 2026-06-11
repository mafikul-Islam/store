import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, updateDoc, onSnapshot, query, orderBy, where, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, updateProfile } from 'firebase/auth';

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    image: string;
    description?: string;
}

export interface User {
    id: string;
    name: string;
    username?: string;
    email: string;
    role: 'user' | 'admin';
}

export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    userId: string;
    userName: string;
    items: OrderItem[];
    total: number;
    shippingAddress: string;
    status: 'pending' | 'shipped' | 'delivered';
    createdAt: number;
}

// Global cached state tracking for synchronous access in React without refactoring everything
let currentProducts: Product[] = [];
let currentUser: User | null = null;
let currentOrders: Order[] = [];
let onProductsChange: () => void = () => {};
let onAuthChange: () => void = () => {};
let onOrdersChange: () => void = () => {};

// Let the application subscribe to changes
export function subscribeToProducts(callback: () => void) {
    onProductsChange = callback;
}
export function subscribeToAuth(callback: () => void) {
    onAuthChange = callback;
}
export function subscribeToOrders(callback: () => void) {
    onOrdersChange = callback;
}

// Default export fetches
export function getProducts(): Product[] {
    return currentProducts;
}
export function getCurrentUser(): User | null {
    return currentUser;
}
export function getOrders(): Order[] {
    return currentOrders;
}
export function isAuthenticated(): boolean {
    return currentUser !== null;
}
export function isAdmin(): boolean {
    return currentUser?.role === 'admin';
}

// Initializer
let authUnsub: (() => void) | null = null;
let ordersUnsub: (() => void) | null = null;
let productsUnsub: (() => void) | null = null;

export function initStore() {
    productsUnsub = onSnapshot(collection(db, 'products'), (snapshot) => {
        currentProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        onProductsChange();
    });

    authUnsub = auth.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
            // Check if user is admin
            const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
            const isAdmin = adminDoc.exists();
            currentUser = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                email: firebaseUser.email || '',
                role: isAdmin ? 'admin' : 'user'
            };
            
            // Sub to orders if logged in
            const ordersQuery = isAdmin 
                ? query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
                : query(collection(db, 'orders'), where('userId', '==', firebaseUser.uid));
            
            if (ordersUnsub) ordersUnsub();
            ordersUnsub = onSnapshot(ordersQuery, (snapshot) => {
                let orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
                if (!isAdmin) {
                   orders.sort((a, b) => b.createdAt - a.createdAt);
                }
                currentOrders = orders;
                onOrdersChange();
            });

        } else {
            currentUser = null;
            currentOrders = [];
            if (ordersUnsub) { 
                ordersUnsub(); 
                ordersUnsub = null; 
            }
        }
        onAuthChange();
    });
}

// --- Auth --- //
export async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
}

export async function login(emailOrUsername?: string, password?: string) {
    if (!emailOrUsername || !password) throw new Error("Email/Username and password required");
    
    let loginEmail = emailOrUsername;
    let firebasePassword = password;
    const isDefaultAdminInput = emailOrUsername.toLowerCase() === 'admin';
    
    if (isDefaultAdminInput) {
        loginEmail = 'admin@example.com';
    } else if (!loginEmail.includes('@')) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', emailOrUsername));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            throw new Error("Invalid username or password");
        }
        loginEmail = snapshot.docs[0].data().email;
    }

    // Firebase requires 6 chars minimum, so if user typed exactly "admin", pad it behind the scenes for the admin account
    if (loginEmail === 'admin@example.com' && password === 'admin') {
        firebasePassword = 'adminpassword123';
    }

    try {
        const res = await signInWithEmailAndPassword(auth, loginEmail, firebasePassword);
        
        // Auto-elevate the bootstrap admin account
        if (loginEmail === 'admin@example.com') {
            const adminDoc = await getDoc(doc(db, 'admins', res.user.uid));
            if (!adminDoc.exists()) {
                await setDoc(doc(db, 'admins', res.user.uid), { role: 'admin', createdAt: Date.now() });
            }
            // Ensure they exist in 'users'
            const userDoc = await getDoc(doc(db, 'users', res.user.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, 'users', res.user.uid), {
                    name: 'Admin User',
                    username: 'admin',
                    email: 'admin@example.com',
                    createdAt: Date.now()
                });
            }
        }
    } catch (err: any) {
        // If the email is admin@example.com and the password matches any bootstrap password, try to register on-the-fly
        if (loginEmail === 'admin@example.com' && (password === 'admin' || password === 'adminpassword123')) {
            try {
                const res = await createUserWithEmailAndPassword(auth, loginEmail, 'adminpassword123');
                await updateProfile(res.user, { displayName: 'Admin User' });
                
                await setDoc(doc(db, 'users', res.user.uid), {
                    name: 'Admin User',
                    username: 'admin',
                    email: 'admin@example.com',
                    createdAt: Date.now()
                });
                
                await setDoc(doc(db, 'admins', res.user.uid), {
                    role: 'admin',
                    createdAt: Date.now()
                });
                return;
            } catch (createErr: any) {
                console.error("Auto-registration of admin failed:", createErr);
                throw new Error("Failed to sign in. If this is a new Firebase project, please verify that the 'Email/Password' sign-in provider is enabled in your Firebase Console under Authentication -> Sign-in method.");
            }
        }
        throw err;
    }
}

export async function registerUser(name: string, username: string, email: string, password: string) {
    if (!username) throw new Error("Username is required");
    
    // Check if username is already taken
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        throw new Error("Username is already taken");
    }

    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: name });
    
    await setDoc(doc(db, 'users', res.user.uid), {
        name,
        username,
        email,
        createdAt: Date.now()
    });

    if (email === 'admin@example.com') {
        await setDoc(doc(db, 'admins', res.user.uid), { role: 'admin', createdAt: Date.now() });
    }
}

export async function logout() {
    await signOut(auth);
}

// --- Products --- //
export async function addProduct(product: Omit<Product, 'id'>) {
    const newDoc = doc(collection(db, 'products'));
    await setDoc(newDoc, {
        name: product.name,
        category: product.category,
        price: Number(product.price),
        stock: Number(product.stock),
        image: product.image
    });
}

export async function updateProduct(id: string, productData: Omit<Product, 'id'>) {
    await updateDoc(doc(db, 'products', id), {
        name: productData.name,
        category: productData.category,
        price: Number(productData.price),
        stock: Number(productData.stock),
        image: productData.image
    });
}

export async function deleteProduct(productId: string) {
    await deleteDoc(doc(db, 'products', productId));
}

// --- Orders --- //
export async function addOrder(order: Omit<Order, 'id' | 'createdAt'>) {
    const newDoc = doc(collection(db, 'orders'));
    const orderData = {
        userId: order.userId,
        userName: order.userName,
        items: order.items,
        total: order.total,
        shippingAddress: order.shippingAddress,
        status: order.status,
        createdAt: Date.now()
    };
    await setDoc(newDoc, orderData);
    
    // Update products stock locally/remotely
    for (const item of order.items) {
        const product = currentProducts.find(p => p.id === item.productId);
        if (product) {
            await updateDoc(doc(db, 'products', product.id), { stock: Math.max(0, product.stock - item.quantity) });
        }
    }
}

export async function updateOrderStatus(orderId: string, status: Order['status']) {
    await updateDoc(doc(db, 'orders', orderId), { status });
}
