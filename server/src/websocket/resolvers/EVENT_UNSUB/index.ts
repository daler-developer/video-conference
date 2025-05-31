import createResolverByMessageType from '../../createResolverByMessageType';
import subscriptionManager from '../../SubscriptionManager';

export default createResolverByMessageType({
  messageType: 'EVENT_UNSUB',
  middleware: [],
  execute({ ws, msg }) {
    // subscriptionManager.subscribe(msg.eventName, {
    //   ws,
    //   params:
    // });
  },
});
