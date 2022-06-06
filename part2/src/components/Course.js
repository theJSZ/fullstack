const Course = ({ course }) => {
  return (
    <>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  )
}

const Header = (props) => {
  return (
    <h1>{props.course.name}</h1>
  )
}

const Part = (props) => {
  return (
    <p>{props.partName} {props.partExercises}</p>
  )
}

const Content = (props) => {
  return (
    <div>
      {props.parts.map(x => <Part key={x.id} partName={x.name} partExercises={x.exercises} />)}
    </div>
  )
}

const Total = (props) => {
  const total = props.parts.reduce(function(sum, ex) {
    return sum + ex.exercises
  }, 0)
 
  return (
    <p>
      <b>total of {total} exercises</b> 
    </p>
  )
}

export default Course