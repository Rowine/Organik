import { IOrderItems } from './IOrderDetailsState'

export default interface IOrderListMy {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  orders: IOrderItems[]
  error: string | undefined
}
