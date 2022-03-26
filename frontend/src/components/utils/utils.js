// export async function retrieveDBData({ symbol }) {
//     const response = await fetch(`http://127.0.0.1:8000/api/tickerhistoricinfo/?ticker=${symbol}/`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//         }
//     })

//     let data = await response.json()

//     if (response.status === 200) {
//         return data
//     } else {
//         throw new Error(response.statusText)
//     }
// }


export async function retrieveAPIData(symbol) {
    const response = await fetch('sample.json', {
    // const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${process.env.REACT_APP_ALPHAVANTAGE_APIKEY}`, {
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


export async function retrieveTicker(symbol, authTokens) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/tickers/?symbol=${symbol}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })

        let data = await response.json()

        return data[0]
    } catch (e) {
        console.log(e)
        const response = await fetch('http://127.0.0.1:8000/api/tickers/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify({'symbol': symbol})
        })

        let data = await response.json()

        if (response.status === 200) {
            return data
        } else {
            console.log(response.statusText)
        }
    }
}


// export async function updateDBData(data) {
//     let ticker = await fetch('http://127.0.0.1:8000/api/ticker/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//             'Authorization': 'Bearer ' + String(authTokens.access)
//         },
//         body: JSON.stringify({
//             'symbol': symbol,
//         })
//     })

//     for (const entry of data) {
//         await fetch('http://127.0.0.1:8000/api/tickerhistoricinfo/' , {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json',
//                 'Authorization': 'Bearer + String('
//             }
//         })
//     }
// }