/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
    interface Window {
        electron: {
            on: (chanel: string, file?: IFile) => Promise<any>;
            startFunction: (chanel: string,) => Promise<string>;
            getAllBooks: (chanel: string, file?: IFile, currentPage: number, maxFilesPerPage: number) => Promise<any>;
            createUser: (chanel: string, userData: IUser) => Promise<any>;
            getAllUsers: (chanel: string, user?: IUSer) => Promise<any>;
        };
    }
}

export { };
