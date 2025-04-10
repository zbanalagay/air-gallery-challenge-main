import { Clip } from "../api/clips";

interface IJustifiedRowsProps {
    assets: Clip[];
    containerWidth: number;
    targetRowHeight: number;
    gap: number;
    hasMore: boolean;
}
export function createJustifiedRows({
  assets,
  containerWidth,
  targetRowHeight,
  gap,
  hasMore,
}:IJustifiedRowsProps) {
  const rows = [];
  let currentRow: Clip[] = [];
  let aspectSum = 0;

  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i];
    const aspect = asset.width && asset.height ? asset.width / asset.height : 1;
    currentRow.push(asset);
    aspectSum += aspect;

    const totalGaps = (currentRow.length - 1) * gap;
    const scaledWidth = aspectSum * targetRowHeight + totalGaps;

    if (scaledWidth >= containerWidth || i === assets.length - 1) {
      const rowShouldJustify =
        scaledWidth >= containerWidth || !hasMore || i === assets.length - 1;

      const rowHeight = rowShouldJustify
        ? (containerWidth - totalGaps) / aspectSum
        : targetRowHeight;

      const widths = currentRow.map((asset) =>
        rowHeight * (asset.width && asset.height ? asset.width / asset.height : 1)
      );

      rows.push({
        assets: currentRow.map((asset, i) => ({
          ...asset,
          _layoutWidth: widths[i],
          _layoutHeight: rowHeight,
        })),
        height: rowHeight,
      });

      currentRow = [];
      aspectSum = 0;
    }
  }

  return rows;
}