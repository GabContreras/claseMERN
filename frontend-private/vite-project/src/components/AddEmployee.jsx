import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditEmployee.css'; // Reutilizamos los estilos del formulario de edición

const AddEmployee = () => {
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState({
    name: '',
    lastName: '',
    birthday: '',
    email: '',
    address: '',
    hireDate: '',
    password: '',
    telephone: '',
    dui: '',
    isssNumber: '',
    isVerified: false
  });
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployee({
      ...employee,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/employees', employee);
      setSuccess(true);
      setError(null);
      // Limpiar el formulario
      setEmployee({
        name: '',
        lastName: '',
        birthday: '',
        email: '',
        address: '',
        hireDate: '',
        password: '',
        telephone: '',
        dui: '',
        isssNumber: '',
        isVerified: false
      });
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/employees');
      }, 2000);
    } catch (err) {
      setError('Error al agregar el empleado');
      setSuccess(false);
      console.error(err);
    }
  };

  return (
    <div className="edit-employee-container">
      <h2>Agregar Nuevo Empleado</h2>
      {success && <div className="success-message">Empleado agregado con éxito!</div>}
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={employee.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Apellido:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={employee.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="birthday">Fecha de Nacimiento:</label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            value={employee.birthday}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={employee.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Dirección:</label>
          <textarea
            id="address"
            name="address"
            value={employee.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="hireDate">Fecha de Contratación:</label>
          <input
            type="date"
            id="hireDate"
            name="hireDate"
            value={employee.hireDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={employee.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="telephone">Teléfono:</label>
          <input
            type="tel"
            id="telephone"
            name="telephone"
            value={employee.telephone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dui">DUI:</label>
          <input
            type="text"
            id="dui"
            name="dui"
            value={employee.dui}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="isssNumber">Número ISSS:</label>
          <input
            type="text"
            id="isssNumber"
            name="isssNumber"
            value={employee.isssNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group checkbox-group">
          <label htmlFor="isVerified">
            <input
              type="checkbox"
              id="isVerified"
              name="isVerified"
              checked={employee.isVerified}
              onChange={handleChange}
            />
            Verificado
          </label>
        </div>

        <div className="button-group">
          <button type="submit" className="btn-save">Guardar Empleado</button>
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => navigate('/employees')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee; 