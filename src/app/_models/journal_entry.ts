import {Transaction} from "./journal_transaction";

export class JournalEntry {
  journal_entry_id: number;
  type: string;
  date: string;
  user_id: string;
  transactions: Transaction[];
  posting_reference: number;
  status: string;
  description: string;
}
