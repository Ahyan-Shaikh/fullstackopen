const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3='State of a compenent'
  const exercises3 = 14

  return (
    <div>
      <Header course={course}/>
      <Content
        part1={part1}
        exercises1={exercises1}
        part2={part2}
        exercises2={exercises2}
        part3={part3}
        exercises3={exercises3}
      />
      <Total
        part1={exercises1}
        part2={exercises2}
        part3={exercises3}
      />
    </div>
  )
}

const Header = (title) => {
  return (
    <h1>{title.course}</h1>
  )
}


const Content = (contents) => {
  return (
    <div>
      <Part name={contents.part1} count={contents.exercises1}/>
      <Part name={contents.part2} count={contents.exercises2}/>
      <Part name={contents.part3} count={contents.exercises3}/>
    </div>
  )
}

const Total = (exercises) => {
    const sum = exercises.part1 + exercises.part2 + exercises.part3;

  return (
    <p>Number of exercises {sum}</p>
  )
}

const Part = (excersise) => {
  return (
    <p>{excersise.name} {excersise.count}</p>
  )
}


export default App
