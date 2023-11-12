export interface IProperty {
  id?: number;
  owner?: string;
  address?: string;
  type: 'Store' | 'Home';
  amount: number;
  status?: boolean;
  tenant?: string;
}