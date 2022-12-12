export default interface IOrderPayState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | undefined
}
