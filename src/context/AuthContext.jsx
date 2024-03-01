import React, { createContext, useContext, useState, useEffect } from "react";
import { fireBaseApp, fireStore } from "../Auth/Firebase";

import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

const auth = getAuth(fireBaseApp);

// Crea un contexto para el estado de autenticación
export const AuthContext = createContext();

// Proveedor de contexto para gestionar el estado de autenticación
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate(); // Usar useNavigate para redirigir

  // Estado para almacenar la información del usuario

  //almacenar la id del item a actualizar
  const [itemID, setItemID] = useState("");

  //Almacenar solo el id del usuario que inicio sesion.
  const [userId, setUserId] = useState("");
  //Almacenar los nombres y apllidos e ids de empleados para mostrarlos siempre que sea necesario
  const [personal, setPersonal] = useState([]);

  //ToDo!! almacenar los datos de la tabla usuariosLogin
  const [userInformation, setUserInformation] = useState({});

  useEffect(() => {
    // Observador de cambios de autenticación de Firebase
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      try {
        if (authUser) {
        } else {
          // El usuario ha cerrado sesión
        }
      } catch (error) {
        console.error("Error al obtener información del usuario:", error);
        // Manejar el error según tus necesidades
      }
      //nombresEmpleados debe estar dento del if para mayor seguridad, esto garantiza que solo se muestren datos
      //cuando este utentificado
      nombresEmpleados();
    });

    // Limpia el observador al desmontar el componente
    return () => {
      unsubscribe();
    };
  }, [auth.currentUser]);
  // Función para iniciar sesión
  const signIn = async (email, password, au) => {
    try {
      await signInWithEmailAndPassword(au, email, password).then(
        (usuarioFirebase) => {
          setUserId(usuarioFirebase.user.uid);
          navigate("/dashboard");
        }
      );
    } catch (error) {
      navigate("/");
      if (error.code === "auth/invalid-credential") {
        alert(
          "Credenciales inválidas. Verifique su correo electrónico y contraseña."
        );
      } else {
        alert("Algo ha salido mal: " + error.message); // Mostrar el mensaje de error
      }
    }
  };

  //Funcion para cambiar cerrar sesion y redirigir al usuario
  const signOutAndRedirect = async (aut) => {
    try {
      await signOut(aut);
      navigate("/");
      setUserInformation({});
      console.log("Ha salido del sistema");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
      throw error;
    }
  };

  //Logica de traer los nombres de los empleados una sola vez y reutilizarlos siempre en la aplicacion
  const nombresEmpleados = async () => {
    const collectionEmpleados = collection(fireStore, "Personal");
    const resp = await getDocs(collectionEmpleados);
    //aqui se unen los elementos que vienen de la base con su id
    setPersonal(
      resp.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      })
    );
  };

  //Funcion para eliminar elementos de la base
  const eliminar = async (tabla, id) => {
    try {
      await deleteDoc(doc(fireStore, tabla, id));
      if (tabla === "Usuarios") {
        console.log("Empleado eliminado");
      }
    } catch (error) {
      alert("A ocurrido un problema");
    }
  };
  //Mostar todos los items de cualquier unido con su id
  const verItems = async (tablaReferencia, guardar) => {
    const itemsRef = collection(fireStore, tablaReferencia);
    const resp = await getDocs(itemsRef);
    guardar(
      resp.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      })
    );
  };
  // Objeto de valor para proporcionar al contexto
  const contextValue = {
    setItemID,
    signIn,
    signOut: signOutAndRedirect,
    verItems,
    eliminar,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook personalizado para consumir el contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};
