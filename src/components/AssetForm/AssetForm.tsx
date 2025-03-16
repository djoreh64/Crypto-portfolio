"use client";

import { POPULAR_CRYPTOS } from "@/src/consts";
import { addAsset } from "@/src/store/slices/portfolioSlice";
import { motion } from "framer-motion";
import { Loader2, Search, X } from "lucide-react";
import React, { FC, useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./AssetForm.module.scss";
import useFetchPrice from "./hooks/useFetchPrice";
import { v4 } from "uuid";
import FocusLock from "react-focus-lock";
import { parseCost } from "@/src/utils/parseCost";

interface Props {
  onClose: () => void;
}

const AssetForm: FC<Props> = ({ onClose }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<{
    symbol: string;
    name: string;
  } | null>(null);
  const [quantity, setQuantity] = useState("");

  const filteredCryptos = POPULAR_CRYPTOS.filter(
    ({ name, symbol }) =>
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { currentPrice, isLoading, error } = useFetchPrice(
    selectedAsset?.symbol ?? null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAsset || !quantity || !currentPrice) return;

    const quantityNum = Number.parseFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) return;

    dispatch(
      addAsset({
        id: v4(),
        symbol: selectedAsset.symbol,
        name: selectedAsset.name,
        quantity: quantityNum,
        currentPrice,
        priceChangePercent: 0,
      })
    );

    onClose();
  };

  const handleSelectAsset = (crypto: { symbol: string; name: string }) => {
    setSelectedAsset(crypto);
    setSearchTerm("");
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className={styles.assetForm}>
      <div className={styles.formHeader}>
        <h2>Добавить новый актив</h2>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрыть форму"
        >
          <X size={20} />
        </button>
      </div>

      <FocusLock>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="asset-search">Выберите актив</label>
            {selectedAsset ? (
              <div className={styles.selectedAsset}>
                <div className={styles.assetIcon}>
                  {selectedAsset.symbol.substring(0, 2)}
                </div>
                <div className={styles.assetInfo}>
                  <div className={styles.assetName}>{selectedAsset.name}</div>
                  <div className={styles.assetSymbol}>
                    {selectedAsset.symbol}
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.clearButton}
                  onClick={() => setSelectedAsset(null)}
                  aria-label="Очистить выбор"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className={styles.searchContainer}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  id="asset-search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Найти криптовалюту..."
                  className={styles.searchInput}
                />
                {searchTerm && (
                  <button
                    type="button"
                    className={styles.clearButton}
                    onClick={() => setSearchTerm("")}
                    aria-label="Очистить поиск"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}

            {!selectedAsset && searchTerm && (
              <div className={styles.searchResults}>
                {filteredCryptos.length > 0 ? (
                  filteredCryptos.map((crypto) => (
                    <motion.button
                      key={crypto.symbol}
                      className={styles.searchResultItem}
                      onClick={() => handleSelectAsset(crypto)}
                      whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={styles.assetIcon}>
                        {crypto.symbol.substring(0, 2)}
                      </div>
                      <div className={styles.assetInfo}>
                        <div className={styles.assetName}>{crypto.name}</div>
                        <div className={styles.assetSymbol}>
                          {crypto.symbol}
                        </div>
                      </div>
                    </motion.button>
                  ))
                ) : (
                  <div className={styles.noResults}>
                    Криптовалюты не найдены
                  </div>
                )}
              </div>
            )}

            {!selectedAsset && !searchTerm && (
              <div className={styles.popularAssets}>
                <h4>Популярные криптовалюты</h4>
                <div className={styles.popularAssetsList}>
                  {POPULAR_CRYPTOS.slice(0, 6).map((crypto) => (
                    <motion.div
                      key={crypto.symbol}
                      className={styles.popularAssetItem}
                      onClick={() => handleSelectAsset(crypto)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className={styles.assetIcon}>
                        {crypto.symbol.substring(0, 2)}
                      </div>
                      <div className={styles.assetSymbol}>{crypto.symbol}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="quantity">Количество</label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Введите количество..."
              step="any"
              min="0"
              className={styles.input}
              disabled={!selectedAsset}
            />
          </div>

          {selectedAsset && (
            <div className={styles.priceInfo}>
              {isLoading ? (
                <div className={styles.loading}>
                  <Loader2 size={16} className={styles.loadingIcon} />
                  Загрузка текущей цены...
                </div>
              ) : (
                currentPrice && (
                  <div className={styles.currentPrice}>
                    <span>Текущая цена:</span>
                    <span className={styles.price}>${currentPrice}</span>
                  </div>
                )
              )}

              {quantity && currentPrice && (
                <div className={styles.totalValue}>
                  <span>Общая стоимость:</span>
                  <span className={styles.value}>
                    ${parseCost(Number.parseFloat(quantity) * currentPrice)}
                  </span>
                </div>
              )}
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={
                !selectedAsset || !quantity || !currentPrice || isLoading
              }
            >
              Добавить в портфель
            </button>
          </div>
        </form>
      </FocusLock>
    </div>
  );
};

export default AssetForm;
