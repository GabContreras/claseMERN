import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export function useLogin() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert('Por favor, ingresa tu email y contraseña');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch('https://clasemern.onrender.com/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            if (response.ok) {
                // Supón que recibes userData y token del backend:
                const token = await response.text(); // o response.json().token
                login(null, token);
                navigate('/blog', { replace: true }); // <-- Redirige aquí
            } else if (response.status === 401 || response.status === 404) {
                alert('Credenciales incorrectas');
            } else {
                alert('Error al iniciar sesión. Por favor, revisa tus credenciales.');
            }
        } catch (error) {
            alert('Error al iniciar sesión. Por favor, revisa tus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        handleSubmit,
    };
}