import React, { useState, useEffect } from "react";

function TimeDifference({ timestamp }) {
  const [difference, setDifference] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const timestampDate = new Date(timestamp.replace(" ", "T") + "Z");
      const diffInMilliseconds = now - timestampDate;
      const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = diffInSeconds % 60;
      setDifference(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timestamp]);

  return difference;
}

export default TimeDifference;
