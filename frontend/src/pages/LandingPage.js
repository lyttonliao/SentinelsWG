import React from 'react';
import Watchlist from '../components/Watchlist';
import Chart from "../components/Chart"


const LandingPage = () => {
    return (
        <div className="d-flex h-100">
            <Watchlist />
            <Chart />
        </div>
    );
}

export default LandingPage