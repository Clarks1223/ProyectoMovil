import React from "react";
import "./ItemUsuario.css";

export const ItemUsuario = (props) => {
  return (
    <section className="item-usuario-container">
      <section className="imagen">
        <img
          src="https://static.thenounproject.com/png/215503-200.png"
          alt="Imagen de perfil"
        />
      </section>
      <section className="informacion">
        <section className="nombre">
          <p>{props.nombre}</p>
        </section>
      </section>
      <section className="eliminar">
        <button
          className="btn btn-danger"
          onClick={() => props.onDelete(props.ident)}
        >
          Eliminar
        </button>
      </section>
    </section>
  );
};

export default ItemUsuario;
