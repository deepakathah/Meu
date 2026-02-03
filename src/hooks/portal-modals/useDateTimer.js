import { useEffect, useState } from "react";

export const useDateTimer = (isEndDate, apiStartTime) => {
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval;

        if (isEndDate && apiStartTime) {
            const startTimestamp = new Date(apiStartTime).getTime();

            // Convert current UTC time to IST
            const istOffsetInMilliseconds = 5.5 * 60 * 60 * 1000;
            const getISTNow = () => Date.now() + istOffsetInMilliseconds;

            const updateTimer = () => {
                const nowIST = getISTNow();
                const elapsedSeconds = Math.max(0, Math.floor((nowIST - startTimestamp) / 1000));
                setTimer(elapsedSeconds);
            };

            updateTimer();

            interval = setInterval(updateTimer, 1000);
        } else {
            setTimer(0);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isEndDate, apiStartTime]);

    return timer;
};
