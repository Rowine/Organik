import { ICartItems } from './ICartState'

export interface IOrderItems {
  _id: string
  user: {
    id: string
    name: string
    email: string
  }
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
  createdAt: string
  updatedAt: string
}

export default interface IOrderDetailsState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  order: IOrderItems
  error: string | undefined
}
