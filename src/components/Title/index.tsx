import { animated, useSpring } from "@react-spring/web";
import { useEffect } from "react";

import styles from "./index.module.css";

const Title = () => {
    const [spring1, api1] = useSpring(() => ({}));
    const [spring2, api2] = useSpring(() => ({}));

    useEffect(() => {
        api2.start({
            from: { textDecoration: "none", color: "black" },
            to: {
                color: "red",
                textDecoration: "line-through",
            },
            config: {
                duration: 1000,
            },
            delay: 2000,
        });
        api1.start({
            from: { x: -10000, opacity: 0 },
            to: {
                opacity: 1,
                x: 150,
            },
            config: {
                duration: 1000,
            },
            delay: 3000,
        });
        api2.start({
            from: { x: 0, opacity: 1 },
            to: { x: 10000, opacity: 0 },
            config: {
                duration: 1000,
            },
            delay: 4000,
        });
        api1.start({
            from: { x: 150 },
            to: { x: 0 },
            config: {
                duration: 300,
            },
            delay: 4100,
        });
    }, [api1, api2]);

    return (
        <>
            <h3 className={styles.title}>
                <animated.span
                    style={{
                        ...spring1,
                    }}
                >
                    Sudoku Solver
                </animated.span>
                <animated.span
                    style={{
                        ...spring2,
                    }}
                >
                    Seppuku Solver
                </animated.span>
            </h3>
        </>
    );
};

export default Title;
