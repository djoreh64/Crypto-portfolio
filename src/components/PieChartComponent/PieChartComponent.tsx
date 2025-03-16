import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { ASSET_COLORS } from "@/src/consts";
import styles from "../AssetForm/AssetForm.module.scss";
import { FC } from "react";
import { IAsset } from "@/src/types";

interface Props {
  assets: IAsset[];
  totalValue: number;
}

const PieChartComponent: FC<Props> = ({ assets, totalValue }) => {
  const pieData = assets.map((asset) => ({
    name: asset.symbol,
    value: asset.quantity * asset.currentPrice,
    percentage: ((asset.quantity * asset.currentPrice) / totalValue) * 100,
  }));

  return (
    <div className={styles.chartCard}>
      <h3>Распределение портфеля</h3>
      <div className={styles.pieChartContainer}>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              dataKey="value"
              animationDuration={800}
              animationEasing="ease-out"
            >
              {pieData.map(({ name }) => {
                const color =
                  ASSET_COLORS[name as keyof typeof ASSET_COLORS] || "#000";
                return <Cell key={name} fill={color} />;
              })}
            </Pie>

            <Tooltip
              content={({ payload }) => {
                if (!payload || payload.length <= 0) return;

                const data = payload[0].payload;
                return (
                  <div className={styles.customTooltip}>
                    <p>
                      <strong>{data.name}</strong>
                    </p>
                    <p>Стоимость: ${data.value.toFixed(2)}</p>
                    <p>Процент: {data.percentage.toFixed(1)}%</p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChartComponent;
