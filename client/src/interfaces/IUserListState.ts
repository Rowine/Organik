import { IUser } from './IUserLoginState'

export default interface IUserListState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  users: IUser[]
  error: string | undefined
}
