import { NodePath, types } from "@babel/core";
import * as t from "@babel/types";
import { err, Errors } from "./lib";

export enum VariablesStatus {
  StyleSheet = 2,
  ArrayModel = 3,
}

export type VariableState = Record<string, 1 | object> | VariablesStatus;

export class StackedStates {
  private maps: Map<string, VariableState>[] = [];
  private checkingIndex: number = 0;

  public constructor() {
    this.push();
  }

  public push(startChecking?: boolean) {
    if (startChecking) {
      this.checkingIndex = this.maps.length;
    }
    this.maps.push(new Map<string, VariableState>());
  }

  public pop() {
    this.maps.pop();
  }

  public get(name: string, checkingContextOnly?: boolean): VariableState | undefined {
    for (let i = this.maps.length - 1; i >= (checkingContextOnly ? this.checkingIndex : 0); i--) {
      if (this.maps[i].has(name)) {
        return this.maps[i].get(name);
      }
    }

    return undefined;
  }

  public set(name: string, state: VariableState) {
    const map = this.maps[this.maps.length - 1];

    if (!map.has(name)) {
      map.set(name, state);
    }
  }

  public replace(name: string, state: VariableState) {
    this.maps[this.maps.length - 1].set(name, state);
  }
}

export interface ComponentData {
  requiredDependencies: Set<string>;
  providedDependencies: Set<string>;
  optionalProperties?: Set<string>;
}

export interface InterfaceData {
  optionalProperties: string[];
  fields?: Record<string, number>;
}

export interface ComponentTracking {
  push(id: string): void;
  pop(): void;
  provide(dependency: string): void;
  requires(dependency: string): void;
  missingDependencies(): string[];
  setOptionalProps(optionals: string[] | undefined): void;
}

export class AppData {
  protected readonly components = new Map<string, ComponentData>();
  protected readonly redirects = new Map<string, string>();
  protected readonly globalProvidedDependencies = new Set<string>();
  // map `${path}:${exportedTypeName}` to a datasheet
  protected readonly interfaces = new Map<string, InterfaceData>();

  public registerComponent(internal: Internal, name: string): ComponentTracking {
    const data: ComponentData = {
      providedDependencies: new Set<string>(),
      requiredDependencies: new Set<string>(),
    };
    const id = this.composeId(internal, name);
    const stack: (ComponentData | undefined)[] = [data];

    this.components.set(id, data);

    return {
      push: (id: string) => {
        const fullId = internal.typeIdentifiersMapping.get(id) ?? id;
        const data = this.getComponent(fullId, internal);

        if (data) {
          for (const dependency of data.requiredDependencies) {
            if (!stack.some(item => item?.providedDependencies.has(dependency))) {
              data.requiredDependencies.add(dependency);
            }
          }
        }
        stack.push(data);
      },
      pop: () => {
        stack.pop();
      },
      provide: (dependency: string) => {
        data.providedDependencies.add(dependency);
        if (internal.isWrapper && name === "default") {
          this.globalProvidedDependencies.add(dependency);
        }
      },
      requires: (dependency: string) => {
        data.requiredDependencies.add(dependency);
      },
      missingDependencies: () => {
        return [...data.requiredDependencies].filter(item => !this.globalProvidedDependencies.has(item));
      },
      setOptionalProps(optionals: string[] | undefined) {
        data.optionalProperties = new Set(optionals);
      },
    };
  }

  public getComponent(name: string, internal: Internal): ComponentData | undefined {
    let id = internal.typeIdentifiersMapping.get(name) ?? name;

    while (this.redirects.has(id)) {
      id = this.redirects.get(id)!;
    }

    return this.components.get(id);
  }

  public registerInterface(internal: Internal, name: string, data: InterfaceData) {
    const id = this.composeId(internal, name);

    this.interfaces.set(id, data);
    internal.typeIdentifiersMapping.set(name, id);
  }

  public getInterface(id: string): InterfaceData | undefined {
    return this.interfaces.get(id);
  }

  public getComponentOptionalProps(id: string, internal: Internal): ReadonlySet<string> | undefined {
    return this.getComponent(id, internal)?.optionalProperties;
  }

  public registerRedirect(from: string, to: string, internal: Internal) {
    this.redirects.set(this.composeId(internal, from), to);
  }

  public composeId(internal: Internal, name: string): string {
    return `${internal.steelFilePath}:${name}`;
  }

  public testComponent(fullId: string, callback: (data: ComponentData) => void) {
    const id = this.redirects.get(fullId) ?? fullId;
    const data = this.components.get(id);

    if (!data) {
      throw new Error(`Component ${id} not found`);
    }

    callback(data);
  }
}

export interface Internal {
  // settings
  appData: AppData | undefined;
  mapping: Map<string, string>;
  componentsImports: Map<string, string>;
  stack: StackedStates;
  global: string;
  prefix: string;
  importStatement: NodePath<types.ImportDeclaration> | null;
  stateOnly: boolean;
  isComposing?: boolean;
  isFunctionParsing?: boolean;
  filename: string;
  steelFilePath: string;
  packageName: string;
  devLayer: boolean;
  strictFolders: boolean;
  stylesConnected: boolean;
  replaceWeb: string;
  routes?: string[];
  headTag?: boolean;
  bodyTag?: boolean;
  shadow?: boolean;
  hmr?: { local: types.Identifier; exported: types.Identifier | types.StringLiteral; isDynamic?: boolean }[];
  asyncComposing?: boolean;
  autoUnwrapThrows?: boolean;
  // maps a local identifier to `${filePath}:${exportedIdentifier}`
  typeIdentifiersMapping: Map<string, string>;
  isWrapper: boolean;
  usedStylesProps: Set<string>;
  reportError(message: string, node: types.Node, e?: Error): void;

  // component tracking
  componentTracking?: ComponentTracking;

  // reactivity
  ref(arg: types.Expression | null, area: types.Node, name: string | undefined, safe: boolean): types.Expression;
  expr(
    func: types.Expression,
    values: types.Expression[],
    codes: string[],
    area: types.Node,
    name: string | undefined,
    safe: boolean,
  ): types.Expression;

  // advanced
  fieldRef(obj: types.Expression, field: types.Expression, area: types.Node, name?: string): types.Expression;
  deepFieldRef(obj: types.Expression, fields: types.Expression[], area: types.Node, name?: string): types.Expression;

  // models
  setModel(
    arg: types.Expression | types.SpreadElement | types.ArgumentPlaceholder | null,
    usage: types.Node,
    name: string | undefined,
  ): types.Expression;
  mapModel(
    arg: types.Expression | types.SpreadElement | types.ArgumentPlaceholder | null,
    usage: types.Node,
    name: string | undefined,
  ): types.Expression;
  arrayModel(
    arg: types.Expression | types.SpreadElement | types.ArgumentPlaceholder | null,
    usage: types.Node,
    name: string | undefined,
  ): types.Expression;

  // helpers
  ensure(arg: types.MemberExpression | types.OptionalMemberExpression, area: types.Node): types.Expression;
  set(obj: types.Expression, field: types.Expression, value: types.Expression, area: types.Node): types.CallExpression;
  safeInit(arg: types.Expression): types.Expression;

  // components
  Switch(arg: types.ObjectExpression): types.CallExpression;
  ArrayModelView(array: types.Expression, arg: types.Expression): types.CallExpression;

  // safety
  safe(arg: types.FunctionExpression | types.ArrowFunctionExpression): types.CallExpression;

  // dev helpers
  updateIValue(assign: types.AssignmentExpression, left: types.Expression, right: types.Expression): types.Expression;
  wrapFunctionBody(
    fn: types.FunctionDeclaration | types.ObjectMethod | types.ClassMethod | types.ClassPrivateMethod,
  ): void;
  setupPosition(target: types.Expression, area: types.Node): types.Expression;
  wrapFunction(fn: types.FunctionExpression | types.ArrowFunctionExpression): types.Node;
  positionedText(text: types.Expression, area: types.Node): types.Expression;
}

export const ctx = t.identifier("Vasille");
export const runner = t.memberExpression(ctx, t.identifier("runner"));
export const V = t.identifier("V");
