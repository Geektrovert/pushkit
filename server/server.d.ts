import * as WebPush from "web-push";

export as namespace PushKitServer;

export = createSender;

declare function createSender(
  keys: WebPush.VapidKeys,
  email: string
): PushKitSender;

interface PushKitSender {
  webPush: typeof import('web-push');
  send(
    subscription: PushSubscription,
    title: String,
    config?: PushConfig
  ): Promise<WebPush.SendResult>;
}

interface PushConfig{
  body?: String,
  data?: Any,
  badge?: String,
  icon?: String,
  image?: String,
  lang?: String,
  renotify?: Boolean,
  requireInteraction?: Boolean,
  silent?: Boolean,
  tag?: String,
  timestamp?: Number,
  vibrate?:[Number]
}