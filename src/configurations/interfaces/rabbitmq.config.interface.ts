export interface IRabbitmqConfig {
  PROTOCOL: string;
  BROKERS: string[];
  USERNAME: string;
  PASSWORD: string;
  VHOST: string;
  QUEUE_NAME: string;
}
