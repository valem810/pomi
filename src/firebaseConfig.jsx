import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyArFwle4w2fqvA4PDGLHvCn1KyEvVMSYxc",
    authDomain: "pomi-b13d0.firebaseapp.com",
    projectId: "pomi-b13d0",
    storageBucket: "pomi-b13d0.appspot.com", // corregido storageBucket
    messagingSenderId: "831851581765",
    appId: "1:831851581765:web:ed7a7720f0a5f389d66e2c"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, auth, provider }; // Exporta el proveedor también
