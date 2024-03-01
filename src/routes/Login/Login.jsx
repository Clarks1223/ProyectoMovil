import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../../context/AuthContext";
import { fireBaseApp } from "../../Auth/Firebase";
import { getAuth } from "firebase/auth";

const auth = getAuth(fireBaseApp);

export const Login = () => {
  const { signIn } = useAuth();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    signIn(data.email, data.contrasenia, auth);
  };

  return (
    <div className="login-container">
      <header className="text-center">
        <h1>Bienvenido</h1>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Correo electrónico:</label>
          {errors.email?.type === "required" && (
            <p className="error-message">Ingrese su correo electrónico</p>
          )}
          <input
            id="email"
            type="email"
            {...register("email", { required: true })}
            maxLength={40}
            autoComplete="username"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            placeholder="ejemplo@gmail.com"
          />
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          {errors.contrasenia?.type === "required" && (
            <p className="error-message">Ingrese su contraseña</p>
          )}
          <input
            id="password"
            type="password"
            {...register("contrasenia", { required: true })}
            maxLength={10}
            autoComplete="current-password"
            placeholder="*************"
            className={`form-control ${errors.contrasenia ? "is-invalid" : ""}`}
          />
        </div>
        <div className="text-center">
          <input
            className="btn btn-success"
            type="submit"
            value={"Iniciar Sesión"}
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
