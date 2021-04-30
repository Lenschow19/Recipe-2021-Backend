export interface Filter{
  currentPage: number
  itemsPrPage: number

  name?: string
  sortingType?: string
  sorting?: string
  category?: number

  userID?: number
  userIDFavorite?: number
  showFavorites?: boolean

}
