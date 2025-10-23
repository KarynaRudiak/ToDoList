import './App.css'
import AddTodo from './components/AddTodo/AddTodo'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'
import TodoList from './components/TodoList/TodoList'

function App() {


  return (
    <>
      <div className="container">
        <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 16
      }}>
        <h1 className="title">TodoList</h1>
        <ThemeToggle />
      </div>
        <AddTodo/>
        <TodoList/>
      </div>
    </>
  )
}

export default App
