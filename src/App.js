import AddUser from './addUser/AddUser.jsx';
import './App.css';
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import Login from './loginUser/Login.jsx';
import ListTask from './Task/listTask/ListTask.jsx';
import AddTask from './Task/addTask/AddTask.jsx';
import EditTask from './Task/editTask/EditTask.jsx';
function App() {
  const route = createBrowserRouter([
        {
          path:"/signup",
          element:<AddUser/>
        },
        {
          path:'/login',
          element:<Login/>
        },
        {
          path:'/tasks',
          element:<ListTask/>
        },
        {
          path:'/addTask',
          element:<AddTask/>
        },
        {
          path:'/editTask/:id',
          element:<EditTask/>
        }
        
      ])
  return (
    <div className="App">
      <h1 className="title">Lemon Pay</h1>
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;
