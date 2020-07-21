// DTO (Data Transfer Object)

export interface IRootObject {
  navigation?: INavigation;
}

export interface INavigation {
  node?: Array<INode>;
  _level?: number;
}

export interface INode {
  _level?: number;
  _parent?: number;
  _children?: number;
  _grandchildren?: number;
  _title?: string;
  _link?: string;
  node?: Array<INode>;
}