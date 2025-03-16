import { useState } from "react";
import styles from "../PortfolioOverview/PortfolioOverview.module.scss";

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
}

const VirtualizedList = <T,>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
}: VirtualizedListProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight) + 1;
  const endIndex = Math.min(startIndex + visibleCount, items.length);
  const offsetY = startIndex * itemHeight;

  return (
    <div
      className={styles.virtualList}
      style={{
        height: containerHeight,
        overflowY: "auto",
        position: "relative",
      }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: "absolute",
            width: "100%",
          }}
        >
          {items
            .slice(startIndex, endIndex)
            .map((item, index) => renderItem(item, startIndex + index))}
        </div>
      </div>
    </div>
  );
};

export default VirtualizedList;
