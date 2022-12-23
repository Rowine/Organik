export interface IReview {
  _id: string
  name: string
  rating: number
  comment: string
  createdAt: string
  user: string
}

export default interface IProductItem {
  _id: string
  user: string
  createdAt: string
  name: string
  reviews: [] | IReview[]
  image: string
  price: number
  category: string
  countInStock: number
  rating: number
  numReviews: number
  qty: number
}
