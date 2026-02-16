import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SafeEventService {

  /**
   * Ensures event.path[0] is always available
   * Falls back to event.target if path is missing
   */
  normalize(event: any): any {
    if (!event) return event;

    if (!event.path || !event.path.length) {
      const target = event.target || event.srcElement;
      if (target) {
        event.path = [target];
      }
    }

    return event;
  }
}