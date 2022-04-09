import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../context/AppContext';


function News() {
    const { activeStock } = useContext(AppContext)
    let [ articles, setArticles ] = useState([])


    // Sends a 'GET' reequest to News API for the active stock
    async function retrieveNewsArticles() {
        // const date = new Date().toISOString().split('T')[0]
        const url = 'https://newsapi.org/v2/everything?' +
                    `q=${activeStock}-stock&` + 
                    'sortBy=popularity&' +
                    `apiKey=${process.env.REACT_APP_NEWSAPI_APIKEY}`

        let response = await fetch(url)
        let data = await response.json()

        if (response.status === 200) {
            setArticles(data.articles.slice(0, 20))
        } 
    }


    useEffect(() => {
        retrieveNewsArticles()
    }, [activeStock])


    function articlesList() {
        return (
            articles.map((article, i) => {
                return (
                    <div key={i} className="mb-5">
                        {(article.urlToImage !== null) &&
                            <a href={article.url} target="_blank" rel="noreferrer">
                                <img 
                                    src={article.urlToImage}
                                    alt="article_image"
                                    className="w-100 h-25"
                                />
                            </a>
                        }
                        <div className="d-block mt-3">
                            <a href={article.url} target="_blank" rel="noreferrer" className="text-decoration-none">
                                <p>{article.title}</p>
                            </a>
                        </div>
                    </div>
                )
            })
        )
    }


    return (
        <div className="newsContainer">
            <h5 className="newsTitle">{activeStock} News</h5>
            <div className="newsBody">
                {articlesList()}
            </div>
        </div>
    )
}

export default News