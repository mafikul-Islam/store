import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { applicationDefault } from 'firebase-admin/app';

initializeApp({
  credential: applicationDefault()
});

const makeAdmin = async () => {
    const auth = getAuth();
    const db = getFirestore();
    
    // Create admin user
    try {
        const user = await auth.createUser({
            email: 'admin@example.com',
            password: 'adminpassword123',
            displayName: 'Admin User',
        });
        
        await db.collection('users').doc(user.uid).set({
            name: 'Admin User',
            username: 'admin',
            email: 'admin@example.com',
            createdAt: Date.now()
        });
        
        await db.collection('admins').doc(user.uid).set({
            role: 'admin',
            createdAt: Date.now()
        });
        
        console.log('Admin user created successfully:', user.uid);
    } catch (e: any) {
        if (e.code === 'auth/email-already-exists') {
            const user = await auth.getUserByEmail('admin@example.com');
            await auth.updateUser(user.uid, { password: 'adminpassword123' });
            await db.collection('users').doc(user.uid).set({
                name: 'Admin User',
                username: 'admin',
                email: 'admin@example.com',
                createdAt: Date.now()
            }, { merge: true });
            await db.collection('admins').doc(user.uid).set({
                role: 'admin',
                createdAt: Date.now()
            });
            console.log('Admin user updated successfully:', user.uid);
        } else {
            console.error('Error:', e);
        }
    }
};

makeAdmin();
