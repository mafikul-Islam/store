import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const configStr = readFileSync('./firebase-applet-config.json', 'utf8');
const config = JSON.parse(configStr);

const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdmin() {
    try {
        const cred = await createUserWithEmailAndPassword(auth, 'admin@example.com', 'adminpassword123');
        const user = cred.user;
        
        await setDoc(doc(db, 'users', user.uid), {
            name: 'Admin User',
            username: 'admin',
            email: 'admin@example.com',
            createdAt: Date.now()
        });
        
        await setDoc(doc(db, 'admins', user.uid), {
            role: 'admin',
            createdAt: Date.now()
        });
        console.log('Admin account created!');
    } catch (e: any) {
        if (e.code === 'auth/email-already-in-use') {
            const cred = await signInWithEmailAndPassword(auth, 'admin@example.com', 'adminpassword123');
            await setDoc(doc(db, 'admins', cred.user.uid), {
                role: 'admin',
                createdAt: Date.now()
            });
            await setDoc(doc(db, 'users', cred.user.uid), {
                name: 'Admin User',
                username: 'admin',
                email: 'admin@example.com',
                createdAt: Date.now()
            }, { merge: true });
            console.log('Made existing account admin.');
        } else {
            console.error(e);
        }
    }
    process.exit(0);
}

createAdmin();
