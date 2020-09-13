import React, { Component } from 'react';
import axios from 'axios';

class fib extends Component {
    state = {
        seenIndexes: [],
        values:{},
        index: ''
    };

componentDidMount(){
    this.fetchValues();
    this.fetchIndexes();

}

async fetchValues() {
    const values = await axios.get('/api/values/current');
    this.setState({values: values.data});

}

async fetchIndexes() {
    const seenIndexes = await axios.get('/api/values/all');
    this.setState({
        seenIndexes: seenIndexes.data
    });
    
}

renderSeenIndexes() {
    return this.state.seenIndexes.map(({number}) => number).join(', ');
}

renderValues() {
    const entries =[];

    for(let key in this.state.values) {
        entries.push(
            <div key = {key}>
                For index {key} I calculated {this.state.values{key}}}

            </div>        );
    }
    return entries;
}

render() {
    return {
        <div> 
        <form>
        <label>Enter your index: </label>
        <input />
        <button>Submit</button>
        </form>
        </div>
    }
}
}