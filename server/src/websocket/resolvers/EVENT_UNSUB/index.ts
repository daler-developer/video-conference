import createResolverByMessageType from '../../createResolverByMessageType';
import subscriptionManager from '../../SubscriptionManager';
import pubsub from '../../pubsub';

export default createResolverByMessageType({
  messageType: 'EVENT_UNSUB',
  middleware: [],
  execute({ ws, msg }) {
    pubsub.publish('EVENT_UNSUB', {
      ws,
    });
    // subscriptionManager.subscribe(msg.eventName, {
    //   ws,
    //   params:
    // });
  },
});
