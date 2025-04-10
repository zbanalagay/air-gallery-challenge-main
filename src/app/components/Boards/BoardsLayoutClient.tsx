
'use client';

import { useState } from 'react';
import { Board } from '@/app/api/boards';
import BoardItem from './BoardItem';

export default function BoardsLayoutClient({ boards }: { boards: Board[] }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="mx-auto w-full px-20 py-10">
      <button
        onClick={() => setIsCollapsed((prev) => !prev)}
      >
        BOARDS ({boards.length}) {isCollapsed ? '›' : '⌄'}
      </button>

      {!isCollapsed && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(216px,1fr))] gap-5 mt-4">
          {boards.map((board) => (
            <BoardItem board={board} key={board.id} />
          ))}
        </div>
      )}
    </div>
  );
}
