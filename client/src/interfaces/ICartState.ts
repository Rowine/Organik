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
  shippingAddress: {
    address: string
    city: string
    postalCode: string
  }
  paymentMethod: string
  itemsPrice: number
  shippingPrice: number
  totalPrice: number
  error: string | undefined
}
