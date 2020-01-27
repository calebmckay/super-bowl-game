import React from 'react';

const Question = (props) => {
  const awayWinning = props.value === -1 && 'question__value--correct';
  const homeWinning = props.value === 1 && 'question__value--correct';
  const valueFinalized = props.finalized && 'question__value--finalized';
  if (props.yesno) {
    return (
      <div className="question question--yesno">
        <h3 className="question__title">{props.longName}</h3>

      </div>
    )
  } else {
    return (
      <div className="question question--teams">
        <h3 className="question__title">{props.longName}</h3>
        <span className={`question__value question__value--away ${awayWinning} ${valueFinalized}`}>
          {props.awayVal}
        </span>
        <span className={`question__value question__value--home ${homeWinning} ${valueFinalized}`}>
          {props.homeVal}
        </span>
      </div>
    )
  }
}

export default Question;