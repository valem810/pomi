import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Verificar si hay usuario en localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/home"); // Si ya hay un usuario, redirigir a la página principal
    }
  }, [navigate]);

  // Maneja el inicio de sesión con correo electrónico y contraseña
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guarda la información del usuario en localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        })
      );

      alert("Inicio de sesión exitoso!");
      navigate("/home"); // Redirige al usuario a la página principal
    } catch (error) {
      // Manejo de errores más específico
      const errorCode = error.code;
      switch (errorCode) {
        case "auth/user-not-found":
          setError("Usuario no encontrado. Verifica tu correo electrónico.");
          break;
        case "auth/wrong-password":
          setError("Contraseña incorrecta. Inténtalo de nuevo.");
          break;
        default:
          setError("Error al iniciar sesión. Por favor, inténtalo más tarde.");
      }
    }
  };

  // Maneja el inicio de sesión con Google
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Guarda la información del usuario en localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        })
      );

      alert("Inicio de sesión con Google exitoso!");
      navigate("/home");
    } catch (error) {
      setError("Error al iniciar sesión con Google. Inténtalo más tarde.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 w-full bg-black shadow-md">
        <div className="flex-shrink-0">
          <Link to="/">
            <span className="text-white font-montserrat font-bold text-2xl">
              Pomodorito
            </span>
          </Link>
        </div>
        <nav className="flex gap-4 items-center">
          <Link to="/contact" className="text-sm text-gray-400 hover:text-white">
            Contact
          </Link>
          <Link to="/registro" className="text-sm font-medium text-gray-400 hover:text-white">
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto bg-white rounded-md shadow-lg">
          {/* Card Header */}
          <div className="text-center p-6 border-b">
            <h1 className="text-3xl font-bold">Log in to Your Account</h1>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              >
                Iniciar sesión
              </button>
            </form>

            <div className="my-4">
              <button
                onClick={handleGoogleLogin}
                className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100 flex items-center justify-center"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Iniciar sesión con Google
              </button>
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="text-center text-sm mt-4">
              No tienes cuenta?{" "}
              <Link to="/registro" className="text-blue-600 hover:text-blue-800">
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
