import logo from './logo.svg';
import './styles/App.css';

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from "./components/Header.js";
import Home from "./components/Home.js";

function App() {
  return (
    <Router>
      <Header />
      <body>
        <div id="MainContent">
          <Routes>
            <Route element={ <Home/> }  path=''/>
          </Routes>
        </div>
      </body>
    </Router>
  );
}

export default App;