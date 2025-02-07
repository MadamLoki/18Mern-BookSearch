export interface BookInput {
    bookId: string;
    authors: string[];
    description: string;
    title: string;
    image?: string;
    link?: string;
}

export interface Context {
    user?: {
        _id: string;
        username: string;
        email: string;
    };
}