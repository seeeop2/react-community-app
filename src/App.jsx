import './App.css'
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Notfound from "./pages/Notfound.jsx";

function App() {

  return (
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/*" element={<Notfound/>}/>
      </Routes>
  )
}

export default App
