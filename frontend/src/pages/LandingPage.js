import React from 'react';
import Header from '../components/Header';
import Watchlist from '../components/Watchlist';
import Chart from "../components/Chart"
import Search from '../components/Search';
import News from '../components/News'

const LandingPage = () => {
    return (
        <div className="d-flex position-relative h-100">
            <div className="d-block">
                <Header />
                <div className="infoBlock">
                    <Watchlist />
                    <News />
                </div>
            </div>
            <Chart />
            <Search />
        </div>
    );
}

export default LandingPage