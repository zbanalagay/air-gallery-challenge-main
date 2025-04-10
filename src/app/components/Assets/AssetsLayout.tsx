import { fetchAssets} from '../../api/clips'
import AssetsLayoutClient from './AssetsLayoutClient'

export default async function AssetsLayout() {
    const {data: {total, clips: initialAssets}, pagination} = await fetchAssets({cursor: null})
    return (
        <AssetsLayoutClient initialAssets={initialAssets} initialPagination={pagination} totalAssets={total}/>
    )
}