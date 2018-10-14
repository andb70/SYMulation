export class Queue {
  topics = new Map();
  constructor(public maxLenght: number) { }
  add(data: any, MqttTopic: string): boolean {
    /*
     * implementare una mappa in cui la chiave è MqttTopic
     * e il valore è un array a cui viene aggiunto data
     * se l'array supera l'altezza restituisce true
     *
     * ad ogni nuovo topic viene aggiunta una coppia chiave-valore
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
     * https://medium.com/front-end-hacking/es6-map-vs-object-what-and-when-b80621932373
     */
    let value: any[] = [];
    if (this.topics.has(MqttTopic)) {
      value = this.topics.get(MqttTopic);
    }
    value.push(data);
    this.topics.set(MqttTopic, value);

    return value.length > this.maxLenght;
  }
  pull( MqttTopic: string): any {
    /*
     * estrae l'array corrispondente a MqttTopic
     * e lo restituisce
     */
    let value: any[] = this.topics.get(MqttTopic);
    this.topics.delete(MqttTopic);
    return value;
  }
}
