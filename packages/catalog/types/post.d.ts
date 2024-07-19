export type UserPost = {
    caption?: string;
    media_type?: string;
    media_url: string;
    media_height?: number;
    media_width?: number;
    id: number;
};
export declare const UserPost: import("atomico/types/dom").Atomico<{} & {
    caption?: string;
    media_url?: string;
    media_width?: number;
    media_height?: number;
}, {} & {
    caption?: string;
    media_url?: string;
    media_width?: number;
    media_height?: number;
}, {
    new (): HTMLElement;
    prototype: HTMLElement;
}>;
