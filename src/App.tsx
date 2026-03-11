import Router from "./routes";
import "./App.css";
import Header from "./components/header/Header";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <Router />
    </>
  );
    
}

export default App;
