import {Component, OnInit} from '@angular/core';
import {LogMessage} from "../_models/log_messages";
import {EventLogService} from "../_services/event-log.service";

@Component({
  selector: 'app-event-log',
  templateUrl: './event-log.component.html',
  styleUrls: ['./event-log.component.scss']
})
export class EventLogComponent implements OnInit {

  filterValue: string = '';
  messages: LogMessage[] = [];
  sortValue: string;
  sortReverse: boolean = false;

  constructor(private eventLogService: EventLogService) {
    this.eventLogService.eventLogSubject.subscribe((messages: LogMessage[]) => {
      this.messages = messages;
      this.messages.sort((a, b) => {
        if (!this.sortReverse) {
          return ('' + a[this.sortValue]).localeCompare(b[this.sortValue]);
        } else {
          return ('' + b[this.sortValue]).localeCompare(a[this.sortValue]);
        }
      });
    });
  }

  ngOnInit() {

  }

  sortBy(value) {
    if (this.sortValue === value) {
      this.sortReverse = !this.sortReverse;
    } else {
      this.sortReverse = false;
    }
    this.sortValue = value;
    this.updateMessageList();
  }

  filterBy() {
    if (!this.filterValue) {
      return this.messages;
    } else {
      const returnList: LogMessage[] = [];
      this.messages.forEach(message => {
        if (message.user_id.toString() == this.filterValue) {
          returnList.push(message);
        } else if (message.message.includes(this.filterValue)) {
          returnList.push(message);
        } else if (message.timestamp.includes(this.filterValue)) {
          returnList.push(message);
        }
      });
      return returnList;
    }
  }

  updateMessageList() {
    this.eventLogService.updateEventLog();
  }
}
