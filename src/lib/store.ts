import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, updateDoc, onSnapshot, query, orderBy, where, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';

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
    productsUnsub = onSnapshot(collection(db, 'products'), async (snapshot) => {
        let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        currentProducts = products;
        onProductsChange();

        // Auto-seed default premium products if the collection is completely empty
        if (products.length === 0) {
            const seedProducts = [
                {
                    id: "prod_journal",
                    name: "Classic Leather Journal",
                    category: "Stationery",
                    price: 28.00,
                    stock: 50,
                    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600"
                },
                {
                    id: "prod_lamp",
                    name: "Minimalist Brass Desk Lamp",
                    category: "Home",
                    price: 120.00,
                    stock: 15,
                    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600"
                },
                {
                    id: "prod_teaset",
                    name: "Japanese Ceramic Tea Set",
                    category: "Kitchen",
                    price: 85.00,
                    stock: 24,
                    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600"
                },
                {
                    id: "prod_flask",
                    name: "Matte Black Travel Flask",
                    category: "Accessories",
                    price: 36.00,
                    stock: 40,
                    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=600"
                }
            ];
            
            try {
                for (const p of seedProducts) {
                    const { id, ...prodData } = p;
                    await setDoc(doc(db, 'products', id), prodData);
                }
            } catch (err) {
                console.error("Auto-seeding products failed:", err);
            }
        }
    });

    authUnsub = auth.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
            let isAdmin = false;
            try {
                // Auto-elevate known admin emails missing the document
                const isKnownAdmin = firebaseUser.email === 'mafikul.bdset@gmail.com';
                const adminDocRef = doc(db, 'admins', firebaseUser.uid);
                const adminDoc = await getDoc(adminDocRef);
                isAdmin = adminDoc.exists();
                
                if (isKnownAdmin && !isAdmin) {
                    await setDoc(adminDocRef, { role: 'admin', createdAt: Date.now() });
                    const userDocRef = doc(db, 'users', firebaseUser.uid);
                    if (!(await getDoc(userDocRef)).exists()) {
                        await setDoc(userDocRef, {
                            name: firebaseUser.displayName || 'Root Admin',
                            username: 'mafikul',
                            email: firebaseUser.email,
                            createdAt: Date.now()
                        });
                    }
                    isAdmin = true;
                }
            } catch (err) {
                console.error("Failed to fetch or elevate admin:", err);
            }

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
export async function login(emailOrUsername?: string, password?: string) {
    if (!emailOrUsername || !password) throw new Error("Email/Username and password required");
    
    let loginEmail = emailOrUsername;
    let actualPassword = password;
    
    // Strict requirement: mapping 'mafikul' directly to the admin email.
    // Also, as Firebase strictly requires >= 6 character passwords, we pad 'admin' to 'adminpassword123'
    // under the hood to ensure the login never fails just because of Firebase's hard limit, 
    // honoring the user's specific "pass: admin" instruction transparently.
    if (emailOrUsername.toLowerCase() === 'mafikul') {
        loginEmail = 'mafikul.bdset@gmail.com';
        if (password === 'admin') {
            actualPassword = 'adminpassword123';
        }
    } else if (!loginEmail.includes('@')) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', emailOrUsername));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            throw new Error("Invalid username or password.");
        } else {
            loginEmail = snapshot.docs[0].data().email;
        }
    }

    try {
        const res = await signInWithEmailAndPassword(auth, loginEmail, actualPassword);
        return res;
    } catch (err: any) {
        // If login fails for the root admin, attempt to initialize the account automatically.
        if ((err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') && loginEmail === 'mafikul.bdset@gmail.com') {
            try {
                const res = await createUserWithEmailAndPassword(auth, loginEmail, actualPassword);
                await updateProfile(res.user, { displayName: 'Root Admin' });
                await setDoc(doc(db, 'admins', res.user.uid), { role: 'admin', createdAt: Date.now() });
                await setDoc(doc(db, 'users', res.user.uid), {
                    name: 'Root Admin',
                    username: 'mafikul',
                    email: loginEmail,
                    createdAt: Date.now()
                });
                return res;
            } catch (creationErr: any) {
                if (creationErr.code === 'auth/email-already-in-use') {
                    throw new Error("Invalid credentials.");
                }
            }
        }
        throw new Error(err.message || "Invalid credentials.");
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

    if (email === 'mafikul.bdset@gmail.com') {
        await setDoc(doc(db, 'admins', res.user.uid), { role: 'admin', createdAt: Date.now() });
        if (currentUser) {
            currentUser.role = 'admin';
            onAuthChange();
        }
    }
}

export async function logout() {
    await signOut(auth);
}

// --- Products --- //
export async function addProduct(product: Omit<Product, 'id'>, customId?: string) {
    const newDoc = customId ? doc(db, 'products', customId) : doc(collection(db, 'products'));
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
