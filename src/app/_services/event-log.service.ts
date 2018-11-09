import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {LogMessage} from "../_models/log_messages";
import {AuthenticationService} from "./authentication.service";
import {UserService} from "./user.service";
import {AppService} from "./app.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EventLogService {

  eventLogSubject: Subject<LogMessage[]>;
  user_id: number;

  constructor(private authService: AuthenticationService,
              private appService: AppService,
              private userService: UserService,
              private http: HttpClient) {
    this.eventLogSubject = new Subject();

    this.userService.getCurrUser().subscribe(user => {
      this.user_id = user.user_id;
    });

    this.appService.getTimer().subscribe(() => {
      this.updateEventLog();
    });
  }

  getEventLogSubject() {
    return this.eventLogSubject;
  }

  updateEventLog() {
    if (this.authService.isLoggedIn() && this.user_id && this.authService.getUserType()) {
      let urlAddon;
      if (this.authService.getUserType() == 'admin') {
        urlAddon = 'all';
      } else {
        urlAddon = this.user_id.toString();
      }
      this.http.get('https://markzeagler.com/postit-backend/eventlog/' + urlAddon, this.authService.getGETJSONHeaders()).subscribe((messages: LogMessage[]) => {
        this.eventLogSubject.next(messages);
      })
    }
  }
}
