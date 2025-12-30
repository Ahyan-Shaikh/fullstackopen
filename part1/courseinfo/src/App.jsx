const App = () => {
  const course = 'Half Stack application development'

  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a compenent',
      exercises: 14
    }

  ]

  return (
    <div>
      <Header course={course}/>
      <Content
        parts={parts}
      />
      <Total
        parts={parts}
      />
    </div>
  )
}

const Header = (title) => {
  return (
    <h1>{title.course}</h1>
  )
}

/*

*/
const Content = (contents) => {
  console.log(contents.parts)
  return (
    <div>
      <Part part={contents.parts[0]}/>

      <Part part={contents.parts[1]}/>

      <Part part={contents.parts[2]}/>
    </div>
  )
}

const Total = (parts) => {
    const sum = parts.parts[0].exercises +  parts.parts[1].exercises + parts.parts[2].exercises;
  return (
    <p>Number of exercises {sum}</p>
  )
}

const Part = (part) => {
  return (
    <p>{part.part.name} {part.part.exercises}</p>
  )
}


export default App
