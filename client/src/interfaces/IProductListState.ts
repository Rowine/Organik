import IProductItem from './IProductItem'
export default interface IProductListState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  products: IProductItem[]
  error?: string
}
