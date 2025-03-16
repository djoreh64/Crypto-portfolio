import { useState, useEffect } from "react";

const useFetchPrice = (symbol: string | null) => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!symbol) return;

    const fetchPrice = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`
        );
        if (!response.ok) throw new Error("Не удалось получить цену");

        const data = await response.json();
        setCurrentPrice(Number.parseFloat(data.price));
      } catch (err) {
        setError("Не удалось получить текущую цену. Попробуйте снова.");
        setCurrentPrice(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();
  }, [symbol]);

  return { currentPrice, isLoading, error };
};

export default useFetchPrice;
