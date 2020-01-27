import React, { Component } from 'react';
import QuestionList from './components/QuestionList';

import axios from 'axios';
const reqUrl = `http://localhost:${process.env.PORT || 8080}/api`;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: []
    };
  }
  
  componentDidMount() {
    axios.get(reqUrl, { responseType: 'json' })
      .then((response) => {
        console.log(response.data);
        this.setState({questions: response.data})
      });
  }
  render() {
    return (
      <QuestionList questions={this.state.questions} />
    );
  }
}
