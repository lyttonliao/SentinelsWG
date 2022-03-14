import { reverse } from "d3"

export async function getData() {
    let response = await fetch("sample.json", {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    
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

    return reverse(data)
}