import { useEffect, useState } from "react";

export default function LoadingText ({
  text
} : {
  text: string
}) {

  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-lg font-mono font-bold">
      {text}{dots}
    </span>
  )
}