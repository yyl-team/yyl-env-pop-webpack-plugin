export interface EntryItem {
  import?: string | string[]
  dependOn?: string | string[]
  filename: string
  library: any
  runtime: any
}

export type EntryObjectItem = EntryItem | string | string[]

export interface EntryObject {
  [key: string]: EntryObjectItem
}
export type Entry = string | string[] | EntryObject
