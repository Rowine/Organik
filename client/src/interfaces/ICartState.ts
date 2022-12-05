export interface ICartItems {
  _id: string
  product: string
  name: string
  image: string
  price: number
  countInStock: number
  qty: number
}

export default interface ICartState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  cartItems: ICartItems[]
  error: string | undefined
}
