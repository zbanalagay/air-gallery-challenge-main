import { Board } from "@/app/api/boards";
import Image from "next/image";

interface IBoardItemProps {
    board: Board
}
export default function BoardItem({board}: IBoardItemProps){
    if (!board?.thumbnails?.[0]) return null;
    return (board.thumbnails && 
        <div className="relative aspect-square overflow-hidden rounded">
            <Image className="object-cover object-center" src={board.thumbnails[0]} alt={`Image for ${board.title} board`}fill sizes="(max-width: 768px) 100vw, 300px"/>
            <div className="absolute inset-0 bg-black/50 z-10" />
            <button className="absolute bottom-0 left-0 m-2 px-3 py-1 text-lg text-white rounded z-20 hover:underline">{board.title}</button>
        </div>
        
    )
}