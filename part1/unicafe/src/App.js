import React, { useState } from 'react'

const Button = ({ text, handleClick }) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  if (props.good === 0 && props.neutral === 0 && props.bad === 0) {
    return (
      <p>No feedback given</p>
    )
  }
  return (
    <table>
      <tbody>
        <StatisticLine text='good' value={props.good} />
        <StatisticLine text='neutral' value={props.neutral} />
        <StatisticLine text='bad' value={props.bad} />
        <StatisticLine text='all' value={props.good+props.neutral+props.bad} />
        <StatisticLine text='average' value={props.score / (props.good+props.neutral+props.bad) || 0} />
        <StatisticLine text='positive' value={String(100*(props.good/(props.good+props.neutral+props.bad))+' %') || 0} />
      </tbody>
    </table>
  )
}


const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [score, setScore] = useState(0)

  const addGood = () => {
    setGood(good+1)
    setScore(score+1)
  }
  const addNeutral = () => setNeutral(neutral+1)
  const addBad = () => {
    setBad(bad+1)
    setScore(score-1)
  }

  return (
    <div>

      <h1>give feedback</h1>
      
      <Button 
        text='good'
        handleClick={addGood} 
      />
      
      <Button 
        text='neutral'
        handleClick={addNeutral} 
      />
      
      <Button 
        text='bad'
        handleClick={addBad} 
      />
      <h1>statistics</h1>
      
      <Statistics good={good} 
                  neutral={neutral}
                  bad = {bad}
                  score={score}
      />
      

    </div>
  )
}

export default App;
