export interface IUser {
    id: string;
    name: string;
    avatar?: Blob;
    folder_name: string;
    settings?: JSON;
}