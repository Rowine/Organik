import { IUser } from './IUserLoginState'

export default interface IUserDetailsState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  user: IUser
  error: string | undefined
}
