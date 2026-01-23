const Course = (props) => {
    const {course} = props

    let total = course.parts.reduce((a, b) => {
        return {exercises: a.exercises + b.exercises}
    })

    return (
        <>
            <Header course={course.name}/>
            <Content parts={course.parts}/>
            <Total total= {total.exercises}/>
        </>
    )
}

const Header = ({course}) => {
    return (
        <h2>{course}</h2>
    )
    
}
const Content = ({parts}) => {
    return (
    <div>
        {
            parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises}/>)
        }
    </div>
)

}
const Part = ({name, exercises}) => {
  return <p>
    {name} {exercises}
  </p>
}

const Total = (props) => <h4>total of {props.total} exercises </h4>

export default Course