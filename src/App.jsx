import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css'
import Header from './pages/header'
import Products from './pages/Products'
import Cart from './pages/Cart';
import Home from './pages/Home';
import Footer from './pages/Footer';
import LoggIn from './pages/LoggIn';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Cart' element={<Cart />} />
          <Route path='/Products' element={<Products />} />
          <Route path='/loggin' element={<LoggIn />} />
        </Routes>
        <main>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App