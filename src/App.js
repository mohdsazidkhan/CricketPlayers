import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Home from "./pages/Home";
import PlayerDetail from "./pages/PlayerDetail";

function App() {
  return (
    <Router>
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route path="/player-detail/:playerID"  element={<PlayerDetail/>}/>
        </Routes>
    </Router>
  );
}

export default App;
