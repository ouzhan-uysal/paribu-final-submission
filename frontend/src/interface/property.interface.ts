export interface IProperty {
  propertyId: number;
  owner: string;
  address: string;
  type: 'Store' | 'Home';
  amount: number;
  isRented: boolean;
  tenant: string;
  startDate: number;
  endDate: number;
}