export interface Variation {
    children: IDomNode[];
}

export interface SlotsData {
    [k: string]: IDomNode[][];
}

export interface IDomNode {
    name: string;
    attributes: Record<string, string>;
    location: string;
    children: IDomNode[];
    variations?: Variation[];
    // For <MyComponent />
    slotsPreFill?: SlotsData;
    // For <Slot />
    slotName?: string;
}

export interface ComponentDomNode extends IDomNode {
    // slots in component
    slots: string[];
}

export type Checker = (node: IDomNode, chain: IDomNode[]) => boolean;
