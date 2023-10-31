export type ValidationResponse = {
  status: boolean
  errors?: {
    index: number
    msg: string
  }[]
}
