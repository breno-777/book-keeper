export interface IUser {
    id: string;
    name: string;
    avatar?: Blob;
    user_path?: string;
    books_path: string;
    settings?: JSON;
}