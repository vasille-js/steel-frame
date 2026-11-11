export interface IDomNode {
    name: string;
    attributes: Record<string, string>;
    location: string;
    children: IDomNode[];
}

export type Checker = (node: IDomNode, chain: IDomNode[]) => boolean;
