import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);

  // Cargar la lista de empleados
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employees');
      setEmployees(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar la lista de empleados');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Eliminar empleado
  const handleDelete = async (id, name) => {
    if (window.confirm(`¿Estás seguro que deseas eliminar al empleado ${name}?`)) {
      try {
        await axios.delete(`/api/employees/${id}`);
        setDeleteMessage(`Empleado ${name} eliminado con éxito`);
        // Actualizar la lista
        fetchEmployees();
        
        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => {
          setDeleteMessage(null);
        }, 3000);
      } catch (err) {
        setError('Error al eliminar el empleado');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="loading">Cargando empleados...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="employee-list-container">
      <div className="employee-list-header">
        <h2>Lista de Empleados</h2>
        <Link to="/employees/new" className="btn-add">
          Agregar Empleado
        </Link>
      </div>
      
      {deleteMessage && (
        <div className="success-message">{deleteMessage}</div>
      )}

      {employees.length === 0 ? (
        <div className="no-employees">No hay empleados registrados</div>
      ) : (
        <div className="table-container">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Fecha Contratación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.name}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.email}</td>
                  <td>{employee.telephone}</td>
                  <td>{formatDate(employee.hireDate)}</td>
                  <td>
                    <span className={`status ${employee.isVerified ? 'verified' : 'not-verified'}`}>
                      {employee.isVerified ? 'Verificado' : 'No Verificado'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <Link 
                      to={`/employees/edit/${employee._id}`} 
                      className="btn-edit"
                      title="Editar"
                    >
                      <i className="fas fa-edit"></i> Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(employee._id, employee.name)}
                      className="btn-delete"
                      title="Eliminar"
                    >
                      <i className="fas fa-trash-alt"></i> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;