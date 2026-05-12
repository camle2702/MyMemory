/**
 * Album Entity — Core domain model
 */
export interface Album {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly coverImageUrl: string | null
  readonly createdAt: Date
}
