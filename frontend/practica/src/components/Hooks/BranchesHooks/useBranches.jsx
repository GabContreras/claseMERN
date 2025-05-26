import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext'; 

export function useBranchesManager() {
    const { authenticatedFetch, isAuthenticated, user } = useAuth();
    
    const [branches, setBranches] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentBranchId, setCurrentBranchId] = useState(null);

    // Estados del formulario
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [telephone, setTelephone] = useState('');
    const [schedule, setSchedule] = useState('');

    // GET - Obtener todas las sucursales SOLO si es admin o empleado
    const fetchBranches = async () => {
        // Validar tipo de usuario
        if (!user || (user.userType !== 'admin' && user.userType !== 'employee')) {
            setError('No tienes permisos para ver las sucursales.');
            setBranches([]);
            return;
        }
        try {
            setIsLoading(true);
            setError('');
            
            const response = await authenticatedFetch('https://clasemern.onrender.com/api/branches');
            
            console.log('Respuesta del servidor:', response);
            
            if (!response.ok) {
                throw new Error(`Error al cargar las sucursales: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Sucursales recibidas:', data);
            setBranches(data);
        } catch (error) {
            console.error('Error al cargar sucursales:', error);
            setError('No se pudieron cargar las sucursales. ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // POST/PUT - Crear o actualizar sucursal
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isAuthenticated()) {
            setError('Debes iniciar sesión para realizar esta acción');
            return;
        }
        
        // Validaciones
        if (!name.trim()) {
            setError('El nombre de la sucursal es obligatorio');
            return;
        }
        
        if (!address.trim()) {
            setError('La dirección es obligatoria');
            return;
        }
        
        if (!telephone.trim()) {
            setError('El teléfono es obligatorio');
            return;
        }
        
        if (!schedule.trim()) {
            setError('El horario es obligatorio');
            return;
        }
        
        // Validación básica de teléfono (8 dígitos para El Salvador)
        const phoneDigits = telephone.replace(/\D/g, '');
        if (phoneDigits.length !== 8) {
            setError('El teléfono debe tener 8 dígitos (ej: 2234-5678)');
            return;
        }
        
        try {
            setIsLoading(true);
            setError('');
            
            // Preparar datos para envío
            const branchData = {
                name: name.trim(),
                address: address.trim(),
                telephone: telephone.trim(),
                schedule: schedule.trim()
            };
            
            let response;
            
            if (isEditing && currentBranchId) {
                // Actualizar sucursal existente
                console.log('Actualizando sucursal con ID:', currentBranchId);
                
                response = await authenticatedFetch(`https://clasemern.onrender.com/api/branches/${currentBranchId}`, {
                    method: 'PUT',
                    body: JSON.stringify(branchData),
                });
            } else {
                // Crear nueva sucursal
                console.log('Creando nueva sucursal');
                
                response = await authenticatedFetch('https://clasemern.onrender.com/api/branches', {
                    method: 'POST',
                    body: JSON.stringify(branchData),
                });
            }
            
            console.log('Respuesta del servidor:', response);
            
            if (!response.ok) {
                const errorData = await response.json();
                
                // Manejar error de teléfono duplicado
                if (response.status === 400 && errorData.message && 
                    errorData.message.includes('duplicate') || 
                    errorData.message.includes('telephone')) {
                    throw new Error('Ya existe una sucursal con este número de teléfono');
                }
                
                throw new Error(`Error al ${isEditing ? 'actualizar' : 'crear'} la sucursal: ${response.status} ${response.statusText}`);
            }
            
            // Mostrar mensaje de éxito
            setSuccess(`Sucursal ${isEditing ? 'actualizada' : 'creada'} exitosamente`);
            setTimeout(() => setSuccess(''), 3000);
            
            // Actualizar la lista de sucursales
            fetchBranches();
            
            // Cerrar modal y limpiar formulario
            setShowModal(false);
            resetForm();
            
        } catch (error) {
            console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} sucursal:`, error);
            setError(error.message || `Error al ${isEditing ? 'actualizar' : 'crear'} la sucursal`);
        } finally {
            setIsLoading(false);
        }
    };

    // DELETE - Eliminar sucursal
    const handleDeleteBranch = async (branchId, event) => {
        // Detener la propagación para evitar abrir el modal de edición
        if (event) {
            event.stopPropagation();
        }
        
        if (!branchId) {
            console.error('ID de sucursal no válido');
            return;
        }

        if (!isAuthenticated()) {
            setError('Debes iniciar sesión para eliminar sucursales');
            return;
        }
        
        // Confirmar eliminación
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta sucursal? Esta acción no se puede deshacer.')) {
            return;
        }
        
        try {
            setIsLoading(true);
            setError('');
            
            console.log('Intentando eliminar sucursal con ID:', branchId);
            
            const response = await authenticatedFetch(`https://clasemern.onrender.com/api/branches/${branchId}`, {
                method: 'DELETE',
            });
            
            console.log('Respuesta de eliminación:', response);
            
            if (!response.ok) {
                throw new Error(`Error al eliminar la sucursal: ${response.status} ${response.statusText}`);
            }
            
            // Mostrar mensaje de éxito
            setSuccess('Sucursal eliminada exitosamente');
            setTimeout(() => setSuccess(''), 3000);
            
            // Actualizar la lista de sucursales
            fetchBranches();
            
        } catch (error) {
            console.error('Error al eliminar sucursal:', error);
            setError(error.message || 'Error al eliminar la sucursal');
        } finally {
            setIsLoading(false);
        }
    };

    // Limpiar el formulario
    const resetForm = () => {
        setName('');
        setAddress('');
        setTelephone('');
        setSchedule('');
        setIsEditing(false);
        setCurrentBranchId(null);
    };

    // Preparar la edición de una sucursal
    const handleEditBranch = (branch) => {
        setName(branch.name);
        setAddress(branch.address);
        setTelephone(branch.telephone);
        setSchedule(branch.schedule);
        setIsEditing(true);
        setCurrentBranchId(branch._id);
        setShowModal(true);
    };

    return {
        // Estados
        branches,
        setBranches,
        showModal,
        setShowModal,
        isLoading,
        setIsLoading,
        error,
        setError,
        success,
        setSuccess,
        isEditing,
        setIsEditing,
        currentBranchId,
        setCurrentBranchId,
        
        // Estados del formulario
        name,
        setName,
        address,
        setAddress,
        telephone,
        setTelephone,
        schedule,
        setSchedule,
        
        // Funciones
        fetchBranches,
        handleSubmit,
        handleDeleteBranch,
        resetForm,
        handleEditBranch,
    };
}