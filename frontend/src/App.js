import React from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Watchlist from './pages/Watchlist';
import Header from './components/Header'
import { 
    BrowserRouter as Router,
    Routes,
    Route, 
} from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';
import './App.css'


class App extends React.Component {
    render() {
        return (
            <Router>
                <AuthProvider>
                    <Header />
                    <Routes>
                        <Route 
                            path="/watchlist" 
                            element={
                                <PrivateRoute>
                                    <Watchlist />
                                </PrivateRoute>
                            } 
                        />
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage/>} />
                    </Routes>
                </AuthProvider>
            </Router>
        );
    }
}

export default App