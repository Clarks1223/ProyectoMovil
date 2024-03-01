import { useEffect, useState } from "react";
import { ItemUsuario } from "../../components/Usuario/ItemUsuario";
import { MapComponent } from "../../components/Mapa/Mapa";
import "./Dashboard.css";

import { useAuth } from "../../context/AuthContext";
import { fireBaseApp } from "../../Auth/Firebase";
import { getAuth } from "firebase/auth";

const auth = getAuth(fireBaseApp);

export const Dashboard = () => {
  const { signOut, verItems, eliminar } = useAuth();
  const [estado, setEstado] = useState(null);
  const [usuarios, setUsuarios] = useState();
  const [elim, setElim] = useState(false);

  const eliminarEmpleado = async (id) => {
    if (window.confirm("¿Esta seguro de eliminar este empleado?")) {
      try {
        await eliminar("Usuarios", id);
        console.log("Se ha eliminado el empleado correctamente");
        setElim(!elim);
      } catch (error) {
        alert("Ha ocurrido un error", error);
      }
    }
  };

  useEffect(() => {
    verItems("Usuarios", setUsuarios);
  }, [elim]);
  return (
    <>
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-danger"
          onClick={() => {
            signOut(auth);
          }}
        >
          Cerrar Sesion
        </button>
      </div>
      <div className="text-center">
        <h1>Gestion de topografos</h1>
      </div>
      <p>
        Bienvenido usuario administrador en esta pantalla podra verificar la
        ubicacion en tiempo real de los usuarios topografos y tambien gestionar
        el ingreso a la aplicacion
      </p>
      <div className="botones">
        <button
          className="btn btn-primary"
          onClick={() => {
            setEstado(true);
          }}
        >
          Administrar usuarios topografos
        </button>
        <button
          className="btn btn-success"
          onClick={() => {
            setEstado(false);
          }}
        >
          Ver ubicacion de topografos
        </button>
      </div>
      <main>
        {estado === null ? (
          <p>Seleccione una opcion</p>
        ) : estado == true ? (
          <section className="usuarios">
            <h1>Lista de usuarios:</h1>
            <section className="lista-usuarios">
              {usuarios &&
                usuarios.map((usuario) => (
                  <ItemUsuario
                    key={usuario.id}
                    ident={usuario.id}
                    nombre={usuario.nombre}
                    onDelete={eliminarEmpleado}
                  />
                ))}
            </section>
          </section>
        ) : (
          <section className="mapa">
            <h1>Mapa en tiempo real:</h1>
            <section className="mapa-real">
              <MapComponent />
            </section>
          </section>
        )}
      </main>
    </>
  );
};
export default Dashboard;
