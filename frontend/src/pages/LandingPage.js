import React from 'react';
import Watchlist from '../components/Watchlist';
import Chart from "../components/Chart"
import Search from '../components/Search';

const LandingPage = () => {
    return (
        <div className="d-flex position-relative h-100">
            <div className="d-block">
                <Watchlist />
            </div>
            <Chart />
            <Search />
        </div>
    );
}

export default LandingPage