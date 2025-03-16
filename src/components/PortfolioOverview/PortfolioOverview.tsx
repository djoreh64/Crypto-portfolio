"use client";

import { AnimatePresence, motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useState } from "react";
import { AssetForm } from "../AssetForm";
import { AssetTable } from "../AssetTable";
import { PieChartComponent } from "../PieChartComponent";
import styles from "./PortfolioOverview.module.scss";
import { usePortfolio } from "./hooks/usePortfolio";
import { parseCost } from "@/src/utils/parseCost";

const PortfolioOverview = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { assets, removeAsset, isClient, totalValue } = usePortfolio();

  if (!isClient) return null;

  return (
    <div className={styles.portfolioOverview}>
      <div className={styles.header}>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>Общая стоимость портфеля</h3>
            <p className={styles.value}>${parseCost(totalValue)}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Активы</h3> <p className={styles.value}>{assets.length}</p>
          </div>
        </div>
        <button
          className={styles.addButton}
          onClick={() => setIsFormOpen(true)}
          aria-label="Добавить новый актив"
        >
          <Icons.Plus size={20} /> Добавить актив
        </button>
      </div>
      {assets.length > 0 ? (
        <div className={styles.content}>
          <AssetTable
            assets={assets}
            totalValue={totalValue}
            onRemove={removeAsset}
          />
          <div className={styles.charts}>
            <PieChartComponent assets={assets} totalValue={totalValue} />
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h3>В вашем портфеле нет активов</h3>
          <p>Добавьте первый актив, чтобы начать отслеживать портфель</p>
          <button
            className={styles.addButton}
            onClick={() => setIsFormOpen(true)}
          >
            <Icons.Plus size={20} /> Добавить актив
          </button>
        </div>
      )}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            onClick={() => setIsFormOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalBackdrop}
          >
            <motion.div
              initial={{ scale: 0.9, y: -50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className={styles.modalContent}
            >
              <AssetForm onClose={() => setIsFormOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default PortfolioOverview;
