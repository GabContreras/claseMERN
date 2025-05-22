// App.jsx
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import Navegation from "./components/Navegation";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navegation />
      </Router>
    </AuthProvider>
  );
}

export default App;