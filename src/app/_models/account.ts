import {Transaction} from "./journal_transaction";

export class Account {
  account_id: number;
  account_title: string;
  normal_side: string;
  description: string;
  balance: number;
  date_created: string;
  created_by: number;
  last_edited_date: string;
  last_edited_by: string;
  is_active: string;
  transactions: Transaction[];
  category: string;
  subcategory: string;
}
