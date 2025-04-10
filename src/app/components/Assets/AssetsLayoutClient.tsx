'use client';

import { useState, useCallback, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import {
    Clip,
    fetchAssets,
    IPagniationClipListResponse,
  } from '@/app/api/clips';
import { useContainerWidth } from '../../hooks/useContainerWidth';
import { createJustifiedRows } from '@/app/utilities/utils';
import AssetItem from './AssetItem';


interface IAssetsLayoutClientProps {
  initialAssets: Clip[];
  initialPagination: IPagniationClipListResponse;
  totalAssets: number;
}

export interface IExtendedClipAsset extends Clip {
  _layoutWidth: number;
  _layoutHeight: number;
}

export default function AssetsLayoutClient({
  initialAssets,
  initialPagination,
  totalAssets
}: IAssetsLayoutClientProps) {
  const [cursor, setCursor] = useState(initialPagination.cursor);
  const [hasMore, setHasMore] = useState(initialPagination.hasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [assets, setAssets] = useState(initialAssets);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [containerRef, containerWidth] = useContainerWidth<HTMLDivElement>();
  const targetRowHeight = 216;
  const gap = 16;

  const loadMoreAssets = useCallback(async () => {
    try {
      setIsLoading(true);
      const {
        data: { clips: newAssets },
        pagination: { cursor: newCursor, hasMore: newHasMore },
      } = await fetchAssets({ cursor });

      if (!newAssets?.length) {
        setHasMore(false);
        return;
      }

      setCursor(newCursor);
      setHasMore(newHasMore);
      setAssets((prev) => {
        const existingIds = new Set(prev.map((a) => a.id));
        return [...prev, ...newAssets.filter((a) => !existingIds.has(a.id))];
      });
    } catch (error) {
      console.error('Error loading more assets:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [cursor]);

  const rows = useMemo(() => {
    if (!containerWidth) return [];
    return createJustifiedRows({
      assets,
      containerWidth,
      targetRowHeight,
      gap,
      hasMore,
    });
  }, [assets, containerWidth, hasMore]);

  return (
    <div ref={containerRef} className="mx-auto w-full px-20 pb-20">
    <button onClick={() => setIsCollapsed(prev => !prev)}>ASSETS ({totalAssets}) {isCollapsed ? '›' : '⌄' }</button>
    {!isCollapsed && <Virtuoso
        data={rows}
        useWindowScroll
        overscan={200}
        endReached={() => {
          if (!isLoading && hasMore) loadMoreAssets();
        }}
        itemContent={(index, row) => (
          <div
            key={index}
            className="flex gap-[16px] mb-[8px] mt-4"
            style={{ height: `${row.height}px` }}
          >
            {row.assets.map((asset: IExtendedClipAsset) => (
              <div
                key={asset.id}
                className="relative overflow-hidden rounded"
                style={{
                  width: `${asset._layoutWidth}px`,
                  height: `${asset._layoutHeight}px`,
                  flexShrink: 0,
                }}
              >
                <AssetItem asset={asset} />
              </div>
            ))}
          </div>
        )}
        components={{
          Footer: () =>
            isLoading ? (
              <div className="text-center py-6 text-sm text-gray-400">Loading more…</div>
            ) : (
              <div className="h-[120px]" />
            ),
        }}
      />}
    </div>
  );
}
