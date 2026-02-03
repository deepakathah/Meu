// timeZone.js
import moment from "moment";
import { useMemo } from "react";

const TimeZone = () => {
  return useMemo(() => {
    const localMoment = moment().second(0);
    const userTime = localMoment.format();
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return { userTime, userTimeZone };
  }, []);
};

export default TimeZone;
