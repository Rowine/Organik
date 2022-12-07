export interface IUser {
  _id: string
  name: string
  email: string
  isAdmin: boolean
  token: string
  password?: string
}

export default interface IUserLoginState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  userInfo: IUser | null
  error: string | undefined
}
