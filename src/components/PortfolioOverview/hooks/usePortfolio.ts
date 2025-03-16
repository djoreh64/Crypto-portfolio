import { removeAsset, updateAssetPrice } from "@/src/store/slices/portfolioSlice";
import { RootState } from "@/src/store/store";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const usePortfolio = () => {
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const assets = useSelector((state: RootState) => state.portfolio.assets);

  const handleRemoveAsset = (id: string) => dispatch(removeAsset(id));

  const totalValue = useMemo(
    () =>
      assets.reduce(
        (sum, { quantity, currentPrice }) => sum + quantity * currentPrice,
        0
      ),
    [assets]
  );

  useEffect(() => {
    setIsClient(true);

    const symbols = assets
      .map((asset) => asset.symbol?.toLowerCase())
      .filter(Boolean);

    if (symbols.length === 0) return;

    const streams = symbols.map((symbol) => `${symbol}usdt@ticker`).join("/");
    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const { data } = JSON.parse(event.data);

      if (data) {
        const symbol = data.s.replace("USDT", "");
        const price = Number.parseFloat(data.c);
        const priceChangePercent = Number.parseFloat(data.P);
        dispatch(updateAssetPrice({ symbol, price, priceChangePercent }));
      }
    };

    return () => {
      ws.close();
    };
  }, [assets, dispatch]);

  return { assets, removeAsset: handleRemoveAsset, isClient, totalValue };
};
