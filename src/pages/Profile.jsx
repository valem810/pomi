import React, { useState, useEffect } from "react";
import { User, Mail, Camera } from "lucide-react";
import { auth } from "../firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(
    auth.currentUser?.photoURL || "/placeholder.svg"
  );
  const [uploading, setUploading] = useState(false);
  const userName = auth.currentUser?.displayName || "Usuario";
  const userEmail = auth.currentUser?.email || "correo@ejemplo.com";

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
    }
  }, [navigate]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);

      try {
        if (!auth.currentUser) {
          alert("El usuario no está autenticado.");
          return;
        }

        const storage = getStorage();
        const storageRef = ref(storage, `profile_images/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        await updateProfile(auth.currentUser, { photoURL: downloadURL });
        setProfileImage(downloadURL);
        alert("¡Foto de perfil actualizada!");
      } catch (error) {
        console.error("Error al subir la imagen: ", error);
        alert("Hubo un error al subir la imagen. Inténtalo de nuevo.");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Perfil de Usuario</h1>

      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-4">
          <img
            className="w-32 h-32 rounded-full object-cover bg-gray-200"
            src={profileImage}
  
          />
          <label
            htmlFor="upload-profile"
            className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600"
          >
            <Camera size={20} />
            <input
              id="upload-profile"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        {uploading && <p className="text-sm text-blue-600">Subiendo imagen...</p>}

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <User className="text-gray-500" size={20} />
            <p className="text-lg font-semibold text-gray-700">{userName}</p>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Mail className="text-gray-500" size={20} />
            <p className="text-lg text-gray-600">{userEmail}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
