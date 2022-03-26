import React from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'
import Header from './components/Header'
import { 
    BrowserRouter as Router,
    Routes,
    Route, 
} from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { AppContextProvider } from './context/AppContext';
// import PrivateRoute from './utils/PrivateRoute';
import AuthRoute from './utils/AuthRoute';
import './static/css/index.css';
import './static/css/custom.min.css';


class App extends React.Component {
    render() {
        return (
            <Router>
                <AuthProvider>
                    <AppContextProvider>
                        <Header />
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route 
                                path="/login" 
                                element={
                                    <AuthRoute>
                                        <LoginPage/>
                                    </AuthRoute>
                                } 
                            />
                            <Route 
                                path="/register" 
                                element={
                                    <AuthRoute>
                                        <RegisterPage/>
                                    </AuthRoute>
                                } 
                            />
                        </Routes>
                    </AppContextProvider>
                </AuthProvider>
            </Router>
        );
    }
}

export default App