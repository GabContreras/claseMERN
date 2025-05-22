// ProductsComponents.jsx
import { useEffect } from 'react';
import './Products.css';
import { useProductsManager } from '../../components/Hooks/ProductsHooks/useProduct';

// Componente de tarjeta para mostrar un producto
const ProductCard = ({ product, onDelete, onEdit }) => {
    // Función para formatear precio
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-SV', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };


    const handleDelete = (e) => {
        e.stopPropagation(); // Evitar que el clic en eliminar también abra el modal de edición
        console.log('ID del producto a eliminar:', product._id);
        onDelete(e);
    };


    return (
        <div className="product-card" onClick={onEdit}>
            <div className="product-card-content">
                <div className="product-header">
                    <h2>{product.name}</h2>
                </div>

                <p className="product-description">{product.description}</p>

                <div className="product-details">
                    <div className="product-price">
                        <span className="price-label">Precio:</span>
                        <span className="price-value">{formatPrice(product.price)}</span>
                    </div>
                    <div className="product-stock">
                        <span className="stock-label">Stock:</span>
                        <span className="stock-value">{product.stock} unidades</span>
                    </div>
                </div>

                <div className="product-card-footer">
                    <span className="product-date">
                        Creado: {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                    <button
                        className="delete-button"
                        onClick={handleDelete}
                        title="Eliminar este producto"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

// Componente de modal para crear/editar producto
const ProductModal = ({
    name,
    setName,
    description,
    setDescription,
    price,
    setPrice,
    stock,
    setStock,
    handleSubmit,
    isLoading,
    isEditing,
    onClose
}) => {
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-group">
                        <label htmlFor="name">Nombre del Producto *</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ingresa el nombre del producto"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Descripción</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe el producto (opcional)"
                            rows="4"
                            disabled={isLoading}
                        ></textarea>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="price">Precio *</label>
                            <input
                                type="number"
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="stock">Stock *</label>
                            <input
                                type="number"
                                id="stock"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                placeholder="0"
                                min="0"
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
const ProductsManager = () => {
    const products = useProductsManager();

    useEffect(() => {
        products.fetchProducts();
        // eslint-disable-next-line
    }, []);



    return (
        <div className="products-manager">
            {/* Header con botón para añadir nuevo producto */}
            <div className="products-header">
                <h1>Gestión de Productos</h1>
                <button
                    className="add-product-button"
                    onClick={() => {
                        products.resetForm();
                        products.setShowModal(true);
                    }}
                >
                    Nuevo Producto
                </button>
            </div>


            {/* Mensajes de error o éxito */}
            {products.error && <div className="error-message">{products.error}</div>}
            {products.success && <div className="success-message">{products.success}</div>}

            {/* Contenedor de tarjetas de productos */}
            <div className="products-cards-container">
                {products.isLoading && !products.products.length ? (
                    <div className="loading">Cargando productos...</div>
                ) : products.products.length === 0 ? (
                    <div className="no-products">No hay productos disponibles</div>
                ) : (
                    products.products.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onDelete={(e) => products.handleDeleteProduct(product._id, e)}
                            onEdit={() => products.handleEditProduct(product)}
                        />
                    ))
                )}
            </div>

            {/* Modal para crear/editar producto */}
            {products.showModal && (
                <ProductModal
                    name={products.name}
                    setName={products.setName}
                    description={products.description}
                    setDescription={products.setDescription}
                    price={products.price}
                    setPrice={products.setPrice}
                    stock={products.stock}
                    setStock={products.setStock}
                    handleSubmit={products.handleSubmit}
                    isLoading={products.isLoading}
                    isEditing={products.isEditing}
                    onClose={() => {
                        products.setShowModal(false);
                        products.resetForm();
                    }}
                />
            )}
        </div>
    );
};

export default ProductsManager;