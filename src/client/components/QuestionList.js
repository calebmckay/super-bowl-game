import React from 'react';
import Question from './Question';

class QuestionList extends React.Component {
  render() {
    return (
      <div className="question-list">
        {
          this.props.questions.map((question) => (
            <Question key={question.questionId} {...question} />
          ))
        }
      </div>
    )
  }
}

export default QuestionList;