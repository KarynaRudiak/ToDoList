import './App.css'
import AddTodo from './components/AddTodo/AddTodo'
import TodoList from './components/TodoList/TodoList'

function App() {


  return (
    <>
      <div className="container">
        <h1 className="title">TodoList</h1>
        <AddTodo/>
        <TodoList/>
      </div>
    </>
  )
}

export default App
