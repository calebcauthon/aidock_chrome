const eventRegistry = new Map();

function when(object, eventName, callback) {
  if (!eventRegistry.has(object)) {
    eventRegistry.set(object, new Map());
  }
  const events = eventRegistry.get(object);
  if (!events.has(eventName)) {
    events.set(eventName, []);
  }
  events.get(eventName).push(callback);
}

function trigger(object, eventName, eventObject) {
  if (eventRegistry.has(object)) {
    const events = eventRegistry.get(object);
    if (events.has(eventName)) {
      events.get(eventName).forEach(callback => callback(eventObject));
    }
  }
}
