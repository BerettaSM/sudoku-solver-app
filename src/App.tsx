import React from "react";

import styles from "./App.module.css";

import SudokuGame from "./components/SudokuGame";

const App: React.FC = () => {
    return (
        <div className={styles.app}>
            <SudokuGame />
        </div>
    );
};

export default App;
