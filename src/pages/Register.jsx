import { useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithPopup
} from "firebase/auth";
import { auth, provider} from "../firebaseConfig";
import { Link } from "react-router-dom";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }
    
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Registro exitoso!");
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                setError("El correo ya está en uso. Intenta con otro.");
            } else {
                setError("Error al registrarse. Intenta nuevamente.");
            }
        }
    };
    
    const handleGoogleRegister = async () => {
        try {
            await signInWithPopup(auth, provider);
            alert("Registro exitoso con Google!");
        } catch (error) {
            setError("Error al registrarse con Google.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center p-4 w-full bg-[#000000] shadow-md">
                <a href="/" className="w-8 h-8">
                    <div className='flex-shrink-0'>
                        <a href="/" className='text-[#ffffff] font-montserrat font-semibold text-2xl'>
                            Pomodorito
                        </a>
                    </div>
                </a>
                <nav className="flex gap-4 items-center">
                    <Link to="/login"
                        className="text-sm font-medium text-[#bdbdbd] hover:text-[#fffefe]"
                    >
                        Log In
                    </Link>
                </nav>
            </header>

            {/* Main */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md mx-auto bg-white rounded-md shadow-lg">
                    {/* Card Header */}
                    <div className="text-center p-6 border-b">
                        <h1 className="text-3xl font-bold">Create an Account</h1>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                        <form onSubmit={handleRegister} className="space-y-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Correo electrónico"
                                required
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#000000]"
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Contraseña"
                                required
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#000000]"
                            />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirma tu contraseña"
                                required
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#000000]"
                            />
                            <button
                                type="submit"
                                className="w-full bg-[#000000] text-white py-2 rounded hover:bg-blue-600"
                            >
                                Registrarse
                            </button>
                        </form>
                        <div className="my-4">
                            <button
                                onClick={handleGoogleRegister}
                                className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100 flex items-center justify-center"
                            >
                                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Registrarse con Google
                            </button>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        <div className="text-center text-sm mt-4">
                            Already have an account?{" "}
                            <Link to="/login"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Log In
                            </Link>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Register;
