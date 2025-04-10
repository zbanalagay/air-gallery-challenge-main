import { createJustifiedRows } from '../utils'; // Adjust path if needed
import type { Clip } from '../../api/clips';

describe('createJustifiedRows', () => {
  const sampleAssets: Clip[] = [
    { id: '1', width: 400, height: 200, type: 'photo', assets: { image: 'url1' } } as Clip,
    { id: '2', width: 400, height: 200, type: 'photo', assets: { image: 'url2' } } as Clip,
    { id: '3', width: 400, height: 200, type: 'photo', assets: { image: 'url3' } } as Clip,
  ];


  it('returns a single justified row', () => {
    const result = createJustifiedRows({
      assets: sampleAssets,
      containerWidth: 1000,
      targetRowHeight: 216,
      gap: 16,
      hasMore: true,
    });

    expect(result.length).toBeGreaterThan(0);
    result.forEach((row) => {
      expect(row.assets.every((a) => '_layoutWidth' in a && '_layoutHeight' in a)).toBe(true);
      expect(row.height).toBeGreaterThan(0);
    });
  });

  it('handles small containers without crashing', () => {
    const result = createJustifiedRows({
      assets: sampleAssets,
      containerWidth: 100,
      targetRowHeight: 216,
      gap: 16,
      hasMore: true,
    });

    expect(result.length).toBeGreaterThan(0);
  });
});
