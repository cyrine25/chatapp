import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Chat from "./components/chat/Chat";
import Join from "./components/join/Join";


function App() {
  return (
    <div className="App">
       
      <Router>
        <Route exact path="/" component={Join} />
        <Route path="/chat" component={Chat} />
       
      </Router>
    </div>
  );
}

export default App;
