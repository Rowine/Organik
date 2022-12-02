export interface IReview {
  name: string
  rating: number
  comment: string
  user: string
}

export default interface IProductItem {
  _id: string
  user: string
  createdAt: string
  name: string
  reviews: []
  image: string
  price: number
  category: string
  countInStock: number
  rating: number
  numReviews: number
}
