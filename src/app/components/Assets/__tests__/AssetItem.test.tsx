import { render, screen, fireEvent } from '@testing-library/react';
import AssetItem from '../AssetItem';
import '@testing-library/jest-dom';
import type { Clip } from '@/app/api/clips';

// Mock next/image to render as a regular <img />
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} role="img" />,
}));

const baseAsset: Partial<Clip> = {
  width: 640,
  height: 480,
  title: 'Test Asset',
  assets: {
    image: 'https://example.com/image.jpg',
  },
};

describe('AssetItem', () => {
  it('renders the image with alt text', () => {
    render(<AssetItem asset={{ ...baseAsset, type: 'photo' } as Clip} />);
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'Test Asset');
    expect(image).toHaveAttribute('src', expect.stringContaining('image.jpg'));
  });

  it('renders a placeholder before image loads', () => {
    render(<AssetItem asset={{ ...baseAsset, type: 'photo' } as Clip} />);
    const placeholder = screen.getByRole('img').previousSibling as HTMLElement;
    expect(placeholder).toHaveClass('animate-pulse');
  });

  it('renders duration for video asset', () => {
    render(
      <AssetItem
        asset={{
          ...baseAsset,
          type: 'video',
          duration: 125,
        } as Clip}
      />
    );
    expect(screen.getByText('2:05')).toBeInTheDocument();
  });

  it('does not render duration for image asset', () => {
    render(<AssetItem asset={{ ...baseAsset, type: 'photo' } as Clip} />);
    expect(screen.queryByText('2:05')).not.toBeInTheDocument();
  });

  it('falls back to alt text "Untitled" if title is missing', () => {
    render(
      <AssetItem
        asset={{
          ...baseAsset,
          title: undefined,
          type: 'photo',
        } as Clip}
      />
    );
    expect(screen.getByAltText('Untitled')).toBeInTheDocument();
  });
});