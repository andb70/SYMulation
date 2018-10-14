export class Queue {
  cache: any = null;
  constructor(public maxLenght: number) { }
  add(data: any, MqttTopic: string): boolean {
    /*
     * implementare una mappa in cui la chiave è MqttTopic
     * e il valore è un array a cui viene aggiunto data
     * se l'array supera l'altezza restituisce true
     *
     * ad ogni nuovo topic viene aggiunta una coppia chiave-valore
     */
    this.cache = data;
    return true;
  }
  pull( MqttTopic: string): any {
    /*
     * estrae l'array corrispondente a MqttTopic
     * e lo restituisce
     */
    return this.cache;
  }
}
