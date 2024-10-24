export interface BudgetItemDetail {
  name: string;
  amount: number;
  percentage: number;
}

export interface BudgetItem {
  category: string;
  amount: number;
  details: BudgetItemDetail[];
}