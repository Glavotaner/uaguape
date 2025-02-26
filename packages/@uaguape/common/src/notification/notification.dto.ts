export class NotificationDto {
  notification?: {
    title?: string;
    body?: string;
  };
  data?: {
    url?: string;
    [key: string]: unknown;
  };
}
