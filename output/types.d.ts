export interface EntryItem {
    import?: string | string[];
    dependOn?: string | string[];
    filename: string;
    library: any;
    runtime: any;
}
export declare type EntryObjectItem = EntryItem | string | string[];
export interface EntryObject {
    [key: string]: EntryObjectItem;
}
export declare type Entry = string | string[] | EntryObject;
