import { useState } from 'react'

const App = () => {

  const[good, setGood] = useState(0)
  const[neutral, setNeutral] = useState(0)
  const[bad, setBad] = useState(0)
  const[total, setTotal] = useState(0)


  const calcAverage = () => {
    return (good + (0 * neutral) + ((-1) * bad)) / 3
  }
  const calcPercentage = () => {
    return ((good / total) * 100) + '%';
  }

  const handleGoodClick = () => {
    const newGood = good+1
    setGood(newGood)
    setTotal(newGood + neutral + bad)
  }

  const handleNeutralClick = () => {
    const newNeutral = neutral + 1
    setNeutral(newNeutral)
    setTotal(newNeutral + good + bad)
  }
  
  const handleBadClick = () => {
    const newBad = bad + 1
    setBad(newBad)
    setTotal(newBad + neutral + good)
  }
  
  return (
    <div>
      <Title title='give feedback'/>
      <Button onClick={handleGoodClick} text='good'/>
      <Button onClick={handleNeutralClick} text='neutral'/>
      <Button onClick={handleBadClick} text='bad'/>

      <Title title='statistics'/>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        avg={calcAverage()}
        positive={calcPercentage()}
      />
    </div>
  )
}
const Title = (props) => <h1>{ props.title }</h1>

const Statistics = ({good, neutral, bad, total, avg, positive}) => {
  if (!total) {
    return <p>No feedback given</p>
  }

  return (
    <div>
      <table>
          <StatisticLine text='good' value={good}/>
          <StatisticLine text='neutral' value={neutral}/>
          <StatisticLine text='bad' value={bad}/>
          <StatisticLine text='all' value={total}/>
          <StatisticLine text='average' value={avg}/>
          <StatisticLine text='positive' value={positive}/>     
      </table>
    </div>
  )
}
const StatisticLine = (props) => {
  
  return (
    <tbody>
      <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
      </tr>
    </tbody>
  )
} 
const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}

export default App
