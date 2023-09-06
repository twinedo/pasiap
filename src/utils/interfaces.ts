import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';

export interface RemoteMessageProps {
  collapseKey?: string;
  messageId?: string;
  messageType?: string;
  from?: string;
  to?: string;
  ttl?: number;
  sentTime?: number;
  data?: {[key: string]: string};
  notification?: FirebaseMessagingTypes.Notification;
  contentAvailable?: boolean;
  mutableContent?: boolean;
  category?: string;
  threadId?: string;
}
