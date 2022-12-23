import IProductItem from './IProductItem'

export default interface IProductDetailsState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  product: IProductItem
  error: string | undefined
}
