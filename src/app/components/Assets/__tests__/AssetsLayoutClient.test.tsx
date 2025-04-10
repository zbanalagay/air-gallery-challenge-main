import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AssetsLayoutClient from '@/app/components/Assets/AssetsLayoutClient';
import '@testing-library/jest-dom';
import { Clip, fetchAssets } from '@/app/api/clips';
import * as utils from '@/app/utilities/utils'; // for createJustifiedRows

// Mock data
const mockAssets: Clip[] = [
  {
    id: '1',
    accountId: 'acc1',
    workspaceId: 'ws1',
    workspaceImage: '',
    workspaceName: 'Workspace',
    source: 'source',
    ext: 'jpg',
    type: 'photo',
    size: 1000,
    status: 'uploaded',
    createdAt: '',
    recordedAt: '',
    updatedAt: '',
    ownerName: 'Owner',
    owner: {
      ownerName: 'Owner',
      ownerAvatar: '',
    },
    avatar: null,
    assets: {
      image: 'https://example.com/1.jpg',
    },
    rotation: 0,
    width: 400,
    height: 300,
    isDefault: false,
    version: 1,
    bookmarked: false,
    altResolutions: [],
    assetId: '',
  },
];

const mockPagination = {
  cursor: 'next-cursor',
  hasMore: true,
};

const justifiedRows = [
  {
    height: 216,
    assets: mockAssets.map((a) => ({
      ...a,
      _layoutWidth: 300,
      _layoutHeight: 216,
    })),
  },
];

// Manual mocks
jest.mock('../AssetItem', () => ({
  __esModule: true,
  default: ({ asset }: any) => <div data-testid="asset">{asset.id}</div>,
}));

jest.mock('react-virtuoso', () => ({
  Virtuoso: ({ data, itemContent }: any) => (
    <div data-testid="virtuoso">
      {data.map((row: any, index: number) => itemContent(index, row))}
    </div>
  ),
}));

jest.mock('../../../hooks/useContainerWidth', () => ({
  useContainerWidth: () => [jest.fn(), 1000],
}));

jest.mock('../../../api/clips', () => ({
  fetchAssets: jest.fn(),
}));

jest.mock('../../../utilities/utils', () => ({
  createJustifiedRows: jest.fn(),
}));

beforeEach(() => {
  (fetchAssets as jest.Mock).mockResolvedValue({
    data: { clips: mockAssets, total: 0 },
    pagination: { cursor: null, hasMore: false },
  });

  (utils.createJustifiedRows as jest.Mock).mockReturnValue(justifiedRows);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('AssetsLayoutClient', () => {
  it('renders initial assets and collapse button', () => {
    render(
      <AssetsLayoutClient
        initialAssets={mockAssets}
        initialPagination={mockPagination}
        totalAssets={2}
      />
    );

    expect(screen.getByText('ASSETS (2) ⌄')).toBeInTheDocument();
    expect(screen.getAllByTestId('asset')).toHaveLength(1);
  });

  it('toggles collapsed state when button is clicked', () => {
    render(
      <AssetsLayoutClient
        initialAssets={mockAssets}
        initialPagination={mockPagination}
        totalAssets={2}
      />
    );

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent('›');

    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent('⌄');
  });

});
