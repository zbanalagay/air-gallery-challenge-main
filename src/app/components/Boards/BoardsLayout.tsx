import { fetchBoards } from '../../api/boards'
import BoardsLayoutClient from './BoardsLayoutClient'

export default async function BoardsLayout() {
    const {data: boards} = await fetchBoards()
    if (!boards) {
        return <div>Loading Boards</div>
    }
    if (!boards.length) {
        return <div>There are no boards</div>
    }
    return (
        <BoardsLayoutClient boards={boards}/>
        
    )
}