// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import './Login.css';

function Login() {
  const { Login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await Login(email, password);
    setLoading(false);

    if (result.success) {
      navigate("/blog", { replace: true });
    } else {
      alert(result.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-logo">
          <img src="https://cdn.worldvectorlogo.com/logos/zeta-gas.svg" alt="Zeta Gas Logo" className="logo-img" />
          <span className="logo-text">ZGas</span>
        </div>
        
        <h1>Iniciar Sesión</h1>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@gmail.com"
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <button 
              type="submit" 
              className="login-button"
              disabled={loading}  
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>
      </div>  
    </div>
  );
}

export default Login;