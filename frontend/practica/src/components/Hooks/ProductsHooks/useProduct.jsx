import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext'; 

export function useProductsManager() {
    const { authenticatedFetch, isAuthenticated } = useAuth();
    
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);

    // Estados del formulario
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');

    // GET - Obtener todos los productos
    const fetchProducts = async () => {
        if (!isAuthenticated()) {
            setError('Debes iniciar sesión para ver los productos');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            
            const response = await authenticatedFetch('http://localhost:3333/api/products');
            
            console.log('Respuesta del servidor:', response);
            
            if (!response.ok) {
                throw new Error(`Error al cargar los productos: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Productos recibidos:', data);
            setProducts(data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            setError('No se pudieron cargar los productos. ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // POST - Crear producto
    const createProduct = async () => {
        const productData = {
            name: name.trim(),
            description: description.trim(),
            price: parseFloat(price),
            stock: parseInt(stock)
        };
        return await authenticatedFetch('http://localhost:3333/api/products', {
            method: 'POST',
            body: JSON.stringify(productData),
        });
    };

    // PUT - Actualizar producto
    const updateProduct = async () => {
        const productData = {
            name: name.trim(),
            description: description.trim(),
            price: parseFloat(price),
            stock: parseInt(stock)
        };
        return await authenticatedFetch(`http://localhost:3333/api/products/${currentProductId}`, {
            method: 'PUT',
            body: JSON.stringify(productData),
        });
    };

    // POST/PUT - Crear o actualizar producto
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated()) {
            setError('Debes iniciar sesión para realizar esta acción');
            return;
        }

        // Validaciones
        if (!name.trim()) {
            setError('El nombre del producto es obligatorio');
            return;
        }

        if (!price || parseFloat(price) < 0) {
            setError('El precio debe ser un número válido mayor o igual a 0');
            return;
        }

        if (!stock || parseInt(stock) < 0) {
            setError('El stock debe ser un número válido mayor o igual a 0');
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            let response;
            if (isEditing && currentProductId) {
                response = await updateProduct();
            } else {
                response = await createProduct();
            }

            if (!response.ok) {
                throw new Error(`Error al ${isEditing ? 'actualizar' : 'crear'} el producto: ${response.status} ${response.statusText}`);
            }

            setSuccess(`Producto ${isEditing ? 'actualizado' : 'creado'} exitosamente`);
            setTimeout(() => setSuccess(''), 3000);
            fetchProducts();
            setShowModal(false);
            resetForm();

        } catch (error) {
            setError(error.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el producto`);
        } finally {
            setIsLoading(false);
        }
    };

    // DELETE - Eliminar producto
    const handleDeleteProduct = async (productId, event) => {
        // Detener la propagación para evitar abrir el modal de edición
        if (event) {
            event.stopPropagation();
        }
        
        if (!productId) {
            console.error('ID de producto no válido');
            return;
        }

        if (!isAuthenticated()) {
            setError('Debes iniciar sesión para eliminar productos');
            return;
        }
        
        // Confirmar eliminación
        if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            return;
        }
        
        try {
            setIsLoading(true);
            setError('');
            
            console.log('Intentando eliminar producto con ID:', productId);
            
            const response = await authenticatedFetch(`http://localhost:3333/api/products/${productId}`, {
                method: 'DELETE',
            });
            
            console.log('Respuesta de eliminación:', response);
            
            if (!response.ok) {
                throw new Error(`Error al eliminar el producto: ${response.status} ${response.statusText}`);
            }
            
            // Mostrar mensaje de éxito
            setSuccess('Producto eliminado exitosamente');
            setTimeout(() => setSuccess(''), 3000);
            
            // Actualizar la lista de productos
            fetchProducts();
            
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            setError(error.message || 'Error al eliminar el producto');
        } finally {
            setIsLoading(false);
        }
    };

    // Limpiar el formulario
    const resetForm = () => {
        setName('');
        setDescription('');
        setPrice('');
        setStock('');
        setIsEditing(false);
        setCurrentProductId(null);
    };

    // Preparar la edición de un producto
    const handleEditProduct = (product) => {
        setName(product.name);
        setDescription(product.description || '');
        setPrice(product.price.toString());
        setStock(product.stock.toString());
        setIsEditing(true);
        setCurrentProductId(product._id);
        setShowModal(true);
    };

    return {
        // Estados
        products,
        setProducts,
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
        currentProductId,
        setCurrentProductId,
        
        // Estados del formulario
        name,
        setName,
        description,
        setDescription,
        price,
        setPrice,
        stock,
        setStock,
        
        // Funciones
        fetchProducts,
        handleSubmit,
        handleDeleteProduct,
        resetForm,
        handleEditProduct,
    };
}