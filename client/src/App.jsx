import { useEffect } from "react";
import { api } from "./api/axios";

function App() {
  useEffect(() => {
    api.get("/").then(res => {
      console.log(res.data);
    });
  }, []);

  return <h1>App Running</h1>;
}

export default App;