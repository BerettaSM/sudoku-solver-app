import React, { useEffect } from "react";
import { animated, useSpring } from "@react-spring/web";

import styles from "./index.module.css";

const Message: React.FC<{ message: string }> = ({ message }) => {
    const [spring, api] = useSpring(() => ({}));

    useEffect(() => {
        if (message === "") return;
        api.start({
            from: {
                x: -1500,
            },
            to: {
                x: 0,
            },
            config: {
                duration: 300,
            },
        });
        api.start({
            from: {
                x: 0,
            },
            to: {
                x: 1500,
            },
            config: {
                duration: 1000,
            },
            delay: 2500,
        });
    }, [api, message]);

    return (
        <div className={styles.message}>
            <animated.span style={{ ...spring }}>{message}</animated.span>
        </div>
    );
};

export default Message;
