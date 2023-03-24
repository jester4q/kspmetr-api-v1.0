export type TCategory = {
    id: number;
    parentId: number;
    name: string;
    level: number;
    url: string;
    children?: TCategory[];
};
