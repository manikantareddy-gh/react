import "bootstrap/dist/css/bootstrap.min.css"
import './App.css'
import { BrowserRouter, Outlet, Route, Router, Routes } from 'react-router-dom'
import Home from './home/Home'
import Librarian from './librarian/Librarian'
import Customer from './customer/Customer'
import Student from './student/Student'
import Styling from './styling/Styling'

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/librarian" element={<Librarian />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/student" element={<Student />} />
          <Route path='/styling' element={<Styling />} />
        </Routes>
      </BrowserRouter>
    </div>

  )
}

export default App
