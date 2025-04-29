import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditEmployee.css';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState({
    name: '',
    lastName: '',
    birthday: '',
    email: '',
    address: '',
    hireDate: '',
    telephone: '',
    dui: '',
    isssNumber: '',
    isVerified: false
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Cargar los datos del empleado
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`/api/employees/${id}`);
        
        // Formatear las fechas para el formato de entrada HTML
        const employeeData = response.data;
        if (employeeData.birthday) {
          employeeData.birthday = new Date(employeeData.birthday).toISOString().split('T')[0];
        }
        if (employeeData.hireDate) {
          employeeData.hireDate = new Date(employeeData.hireDate).toISOString().split('T')[0];
        }
        
        setEmployee(employeeData);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar la información del empleado');
        setLoading(false);
        console.error(err);
      }
    };

    fetchEmployee();
  }, [id]);

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
      await axios.put(`/api/employees/${id}`, employee);
      setSuccess(true);
      setTimeout(() => {
        navigate('/employees'); // Redirigir al listado de empleados después de la actualización
      }, 2000);
    } catch (err) {
      setError('Error al actualizar el empleado');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="edit-employee-container">
      <h2>Editar Empleado</h2>
      {success && <div className="success-message">Empleado actualizado con éxito!</div>}
      
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
          <button type="submit" className="btn-save">Guardar Cambios</button>
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

export default EditEmployee;