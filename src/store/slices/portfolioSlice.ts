import { IAsset } from "@/src/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface PortfolioState {
  assets: IAsset[];
  status: "idle" | "loading" | "failed";
}

const loadAssetsFromStorage = (): IAsset[] => {
  if (typeof window !== "undefined") {
    const savedAssets = localStorage.getItem("portfolio-assets");
    if (savedAssets) return JSON.parse(savedAssets);
  }
  return [];
};

const saveAssetsToStorage = (assets: IAsset[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("portfolio-assets", JSON.stringify(assets));
  }
};

const initializeState = (): PortfolioState => {
  const assets = loadAssetsFromStorage();
  return { assets, status: "idle" };
};

export const saveAssets = createAsyncThunk(
  "portfolio/saveAssets",
  async (assets: IAsset[], { rejectWithValue }) => {
    try {
      saveAssetsToStorage(assets);
    } catch (error) {
      return rejectWithValue("Failed to save assets.");
    }
  }
);

export const portfolioSlice = createSlice({
  name: "portfolio",
  initialState: initializeState(),
  reducers: {
    addAsset: (state, action: PayloadAction<IAsset>) => {
      const asset = action.payload;
      const existingAsset = state.assets.find(
        (item) => item.symbol === asset.symbol
      );

      if (existingAsset) existingAsset.quantity += asset.quantity;
      else state.assets.push(asset);

      saveAssetsToStorage(state.assets);
    },
    removeAsset: (state, action: PayloadAction<string>) => {
      const assetId = action.payload;
      state.assets = state.assets.filter((asset) => asset.id !== assetId);
      saveAssetsToStorage(state.assets);
    },
    updateAssetPrice: (
      state,
      action: PayloadAction<{
        symbol: string;
        price: number;
        priceChangePercent: number;
      }>
    ) => {
      const { symbol, price, priceChangePercent } = action.payload;
      state.assets = state.assets.map((asset) => {
        if (asset.symbol === symbol)
          return {
            ...asset,
            currentPrice: price,
            priceChangePercent,
          };

        return asset;
      });
      saveAssetsToStorage(state.assets);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveAssets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveAssets.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(saveAssets.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { addAsset, removeAsset, updateAssetPrice } =
  portfolioSlice.actions;

export default portfolioSlice.reducer;
