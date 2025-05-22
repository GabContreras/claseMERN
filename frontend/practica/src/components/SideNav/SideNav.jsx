// SideNav.jsx
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import './SideNav.css';

function SideNav() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const isActive = (path) => {
        return location.pathname.includes(path);
    };

    const handleLogout = async () => {
        await fetch('http://localhost:3333/api/logout', {
            method: 'POST',
            credentials: 'include'
        });
        logout();
        navigate('/');
    };

    return (
        <div className="sidenav">
            <Link to="/blog" className="logo-container">
                <div clasame="logo">
                    <span className="logo-icon">z</span>
                    <span className="logo-text">GAS</span>
                </div>
            </Link>
            
            <nav className="nav-menu">
                <ul className="nav-list">
                    <li>
                        <Link 
                            to="/blog" 
                            className={`nav-item ${isActive('/blog') ? 'active' : ''}`}
                        >
                            <i className="nav-icon">🏠</i>
                            <span className="nav-text">Blog</span>
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/products" 
                            className={`nav-item ${isActive('/products') ? 'active' : ''}`}
                        >
                            <i className="nav-icon">💰</i>
                            <span className="nav-text">Products</span>
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/branches" 
                            className={`nav-item ${isActive('/branches') ? 'active' : ''}`}
                        >
                            <i className="nav-icon">🌿</i>
                            <span className="nav-text">Branches</span>
                        </Link>
                    </li>
                </ul>
            </nav>
            
            <div className="logout-container">
                <div className="nav-item logout" onClick={handleLogout}>
                    <i className="nav-icon">📤</i>
                    <span className="nav-text">Log Out</span>
                </div>
            </div>
        </div>
    );
}

export default SideNav;