import { ASSET_COLORS } from "@/src/consts";
import { IAsset } from "@/src/types";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { FC } from "react";
import styles from "../PortfolioOverview/PortfolioOverview.module.scss";
import VirtualizedList from "./VirtualizedList";
import { parseCost } from "@/src/utils/parseCost";

interface Props {
  assets: IAsset[];
  totalValue: number;
  onRemove: (id: string) => void;
}

const AssetTable: FC<Props> = ({ assets, totalValue, onRemove }) => {
  const itemHeight = 60;
  const containerHeight = 400;

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <div>Актив</div>
        <div>Количество</div>
        <div>Цена</div>
        <div>Стоимость</div>
        <div>Изм. 24ч</div>
        <div>Доля</div>
        <div>Действия</div>
      </div>

      <VirtualizedList
        items={assets}
        itemHeight={itemHeight}
        containerHeight={containerHeight}
        renderItem={(asset: IAsset) => {
          const value = asset.quantity * asset.currentPrice;
          const allocation = (value / totalValue) * 100;

          return (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.tableRow}
              style={{ height: itemHeight }}
            >
              <div className={styles.assetName}>
                <div className={styles.assetIcon}>
                  {asset.symbol?.substring(0, 2)}
                </div>
                {asset.name}
              </div>
              <div className={styles.quantity}>{asset.quantity}</div>
              <div className={styles.price}>
                ${parseCost(asset.currentPrice)}
              </div>
              <div className={styles.value}>${parseCost(value)}</div>
              <div
                className={`${styles.change} ${
                  asset.priceChangePercent >= 0 ? "positive" : "negative"
                }`}
              >
                {asset.priceChangePercent >= 0 ? (
                  <Icons.ArrowUpCircle size={16} />
                ) : (
                  <Icons.ArrowDownCircle size={16} />
                )}
                {asset.priceChangePercent?.toFixed(2)}%
              </div>
              <div className={styles.allocation}>
                <div className={styles.allocationBar}>
                  <div
                    className={styles.allocationFill}
                    style={{
                      width: `${allocation}%`,
                      backgroundColor:
                        ASSET_COLORS[
                          asset.symbol as keyof typeof ASSET_COLORS
                        ] || "#000",
                    }}
                  ></div>
                </div>
                {allocation.toFixed(2)}%
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.removeButton}
                  onClick={() => onRemove(asset.id)}
                >
                  <Icons.Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          );
        }}
      />
    </div>
  );
};

export default AssetTable;
