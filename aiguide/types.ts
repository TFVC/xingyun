
export enum Role {
  TONGYONG = '通用',
  PROJECT_MANAGER = '项目经理',
  PRODUCT_MANAGER = '产品经理',
  TECH_LEADER = '技术经理人'
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  roles: Role[]; // 这里决定了工具属于哪些分类
  tag: string;
}

export interface ActivationState {
  isActivated: boolean;
  activationCode: string | null;
}
