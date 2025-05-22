// BranchesComponents.jsx
import { useEffect } from 'react';
import './Branches.css';
import { useBranchesManager } from '../../components/Hooks/BranchesHooks/useBranches';

// Componente de tarjeta para mostrar una sucursal
const BranchCard = ({ branch, onDelete, onEdit }) => {
    // Función para formatear el teléfono
    const formatPhoneNumber = (phone) => {
        if (!phone) return '';
        // Formatear teléfono de El Salvador (ej: 2234-5678 o 7890-1234)
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 8) {
            return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
        }
        return phone;
    };

    // Función para formatear horario
    const formatSchedule = (schedule) => {
        if (!schedule) return 'No especificado';
        return schedule;
    };

    const handleDelete = (e) => {
        e.stopPropagation(); // Evitar que el clic en eliminar también abra el modal de edición
        console.log('ID de la sucursal a eliminar:', branch._id);
        onDelete(e);
    };

    return (
        <div className="branch-card" onClick={onEdit}>
            <div className="branch-card-content">
                <div className="branch-header">
                    <h2>{branch.name}</h2>

                </div>

                <div className="branch-details">
                    <div className="branch-detail-item">
                        <div className="detail-icon">📍</div>
                        <div className="detail-content">
                            <span className="detail-label">Dirección</span>
                            <span className="detail-value">{branch.address}</span>
                        </div>
                    </div>

                    <div className="branch-detail-item">
                        <div className="detail-icon">📞</div>
                        <div className="detail-content">
                            <span className="detail-label">Teléfono</span>
                            <span className="detail-value">{formatPhoneNumber(branch.telephone)}</span>
                        </div>
                    </div>

                    <div className="branch-detail-item">
                        <div className="detail-icon">🕒</div>
                        <div className="detail-content">
                            <span className="detail-label">Horario</span>
                            <span className="detail-value">{formatSchedule(branch.schedule)}</span>
                        </div>
                    </div>
                </div>

                <div className="branch-card-footer">
                    <span className="branch-date">
                        Creada: {new Date(branch.createdAt).toLocaleDateString()}
                    </span>
                    <button
                        className="delete-button"
                        onClick={handleDelete}
                        title="Eliminar esta sucursal"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

// Componente de modal para crear/editar sucursal
const BranchModal = ({
    name,
    setName,
    address,
    setAddress,
    telephone,
    setTelephone,
    schedule,
    setSchedule,
    handleSubmit,
    isLoading,
    isEditing,
    onClose
}) => {
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>{isEditing ? 'Editar Sucursal' : 'Nueva Sucursal'}</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="branch-form">
                    <div className="form-group">
                        <label htmlFor="name">Nombre de la Sucursal *</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Sucursal Centro, Sucursal San Miguel"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Dirección *</label>
                        <textarea
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Dirección completa de la sucursal"
                            rows="3"
                            disabled={isLoading}
                            required
                        ></textarea>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="telephone">Teléfono *</label>
                            <input
                                type="tel"
                                id="telephone"
                                value={telephone}
                                onChange={(e) => setTelephone(e.target.value)}
                                placeholder="7890-1234"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="schedule">Horario *</label>
                            <input
                                type="text"
                                id="schedule"
                                value={schedule}
                                onChange={(e) => setSchedule(e.target.value)}
                                placeholder="Lun-Vie 8:00-17:00, Sáb 8:00-12:00"
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Componente principal que contiene tanto las cards como el modal
const BranchesManager = () => {
    const branches = useBranchesManager();

    useEffect(() => {
        branches.fetchBranches();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="branches-manager">
            {/* Header con botón para añadir nueva sucursal */}
            <div className="branches-header">
                <h1>Gestión de Sucursales</h1>
                <button
                    className="add-branch-button"
                    onClick={() => {
                        branches.resetForm();
                        branches.setShowModal(true);
                    }}
                >
                    Nueva Sucursal
                </button>
            </div>


            {/* Mensajes de error o éxito */}
            {branches.error && <div className="error-message">{branches.error}</div>}
            {branches.success && <div className="success-message">{branches.success}</div>}

            {/* Contenedor de tarjetas de sucursales */}
            <div className="branches-cards-container">
                {branches.isLoading && !branches.branches.length ? (
                    <div className="loading">Cargando sucursales...</div>
                ) : branches.branches.length === 0 ? (
                    <div className="no-branches">No hay sucursales disponibles</div>
                ) : (
                    branches.branches.map((branch) => (
                        <BranchCard
                            key={branch._id}
                            branch={branch}
                            onDelete={(e) => branches.handleDeleteBranch(branch._id, e)}
                            onEdit={() => branches.handleEditBranch(branch)}
                        />
                    ))
                )}
            </div>

            {/* Modal para crear/editar sucursal */}
            {branches.showModal && (
                <BranchModal
                    name={branches.name}
                    setName={branches.setName}
                    address={branches.address}
                    setAddress={branches.setAddress}
                    telephone={branches.telephone}
                    setTelephone={branches.setTelephone}
                    schedule={branches.schedule}
                    setSchedule={branches.setSchedule}
                    handleSubmit={branches.handleSubmit}
                    isLoading={branches.isLoading}
                    isEditing={branches.isEditing}
                    onClose={() => {
                        branches.setShowModal(false);
                        branches.resetForm();
                    }}
                />
            )}
        </div>
    );
};

export default BranchesManager;