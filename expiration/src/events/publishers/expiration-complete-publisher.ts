import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@sm-ticket-app/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
