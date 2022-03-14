import React from "react"
import CandleStickChart from "./charts/CandleStick"
import { getData } from "./utils/utils"


class Chart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        getData().then(data => {
            this.setState({data: data})
        })
    }

    render() {
        if (this.state.data.length === 0) {
            return <div>Loading...</div>
        }
        return (
            <CandleStickChart data={this.state.data} />
        )
    }
}

export default Chart