import {Transaction} from "./journal_transaction";

export class JournalEntry {
  journal_id: number;
  journal_type: string;
  date: string;
  creator: string;
  transactions: Transaction[];
  posting_ref: number;
  journal_status: string;
  description: string;
}
