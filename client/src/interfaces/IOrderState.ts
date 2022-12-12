import { ICartItems } from './ICartState'

export default interface IOrderState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  order: {
    _id: string
    user: string
    orderItems: ICartItems[]
    shippingAddress: {
      address: string
      city: string
      postalCode: string
    }
    paymentMethod: string
    itemsPrice: number
    shippingPrice: number
    totalPrice: number
    isPaid: boolean
    paidAt: string
    isDelivered: boolean
    deliveredAt: string
  }
  error: string | undefined
}
