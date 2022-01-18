import React from 'react';
import LandingPage from './LandingPage'
import Watchlist from './Watchlist'
import { 
    BrowserRouter,
    Routes,
    Route, 
    Link, 
    Redirect
} from "react-router-dom";


class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} >
                        <Route path="/watchlist" element={<Watchlist />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        );
    }
}

export default App