import React from "react";
import AppRouter from "./routes/AppRouter";
import styles from "./styles/App.module.css";

function App() {
  return (
    <div className={styles.container}>
      <AppRouter />
    </div>
  );
}

export default App;
