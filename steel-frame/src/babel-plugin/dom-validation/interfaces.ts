export interface Variation {
    children: IDomNode[];
}

export interface IDomNode {
    name: string;
    attributes: Record<string, string>;
    location: string;
    children: IDomNode[];
    variations?: Variation[];
}

export type Checker = (node: IDomNode, chain: IDomNode[]) => boolean;
