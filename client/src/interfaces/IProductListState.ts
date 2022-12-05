export default interface IProductListState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  products: []
  error?: string
}
