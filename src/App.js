import React from "react";
import AppRouter from "./routes/AppRouter";
import { HomeScreenPrompt } from "./components/HomeScreenPrompt";
import styles from "./styles/App.module.css";
import "./styles/theme.css";

function App() {
  return (
    <div
      className={styles.container}
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <AppRouter />
      <HomeScreenPrompt />
    </div>
  );
}

export default App;
