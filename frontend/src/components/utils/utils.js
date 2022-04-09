// Fetch 20-year daily historic prices of stock
export async function retrieveAPIData(symbol) {
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${process.env.REACT_APP_ALPHAVANTAGE_APIKEY}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    })
    
    if (response.status !== 200) {
        throw new Error(response.statusText)
    }

    let data = await response.json()
    data = Object.entries(data["Time Series (Daily)"]).map(entry => {
        let stock_info = {}
        for (let k of Object.keys(entry[1])) {
            stock_info[k.slice(3,)] = parseFloat(entry[1][k])
        }
        return ({
            "date": entry[0],
            ...stock_info
        })
    })
    return data.reverse()
}

// Fetch ticker data if symbol exists within DB, otherwise create a new ticker object
export async function retrieveTicker(symbol, company) {
    const getResponse = await fetch(`http://127.0.0.1:8000/api/tickers/?symbol=${symbol}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    })

    if (getResponse.status === 200) {
        let data = await getResponse.json()
        if (data.length > 0) { return data }
    }

    const postResponse = await fetch('http://127.0.0.1:8000/api/tickers/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({'company': company, 'symbol': symbol})
    })

    if (postResponse.status === 201) {
        let data = await postResponse.json()
        if (data.length > 0) { return data }
    } else {
        console.log(postResponse.statusText)
    }
}
