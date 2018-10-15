import {Component, OnInit} from '@angular/core';
import {LogicIOService} from './logic-io.service';
import {DataPointType} from './models/DataPointType';
import {ObjectType} from './models/ObjectType';
import {
  DeviceClass,
  DeviceConfigType,
  DeviceParamType,
  SwitchState
} from './models/DeviceClass';
import {CommDriverService} from './comm-driver.service';
import {Query} from './models/Query';
import {Measure} from './models/Measure';
import {Result} from './models/Result';
import {JUtil} from './models/JUtil';

const MqttTopicOLD = 'SYMulation/DataLogger/sensori';
const MqttTopicPath = 'SYMulation/DataLogger/';
const MqttTopicPompa1 = MqttTopicPath; // + 'Pompa1';
const MqttTopicPompa2 = MqttTopicPath; // + 'Pompa2';
const MqttTopicVentilatore = MqttTopicPath; // + 'Ventilatore';
const MqttTopicMotore1 = MqttTopicPath; // + 'Motore1';
const MqttTopicMotore2 = MqttTopicPath; // + 'Motore2';
const MqttTopicVasca1 = MqttTopicPath; // + 'Vasca1';
const MqttTopicVasca2 = MqttTopicPath; // + 'Vasca2';
const MqttTopicVasca3 = MqttTopicPath; // + 'Vasca3';
const MqttTopicVasca4 = MqttTopicPath; // + 'Vasca4';
const MqttTopicVasca5 = MqttTopicPath; // + 'Vasca5';
const MqttTopicVasca6 = MqttTopicPath; // + 'Vasca6';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showTree = true;
  showGoals = true;
  scanning = false;
  root: ObjectType;

  sCurrent = new DataPointType('current',
    0,
    1023,
    0,
    125,
    0,
    1,
    0.8,
    'A'
  );
  sRPM = new DataPointType('rpm',
    0,
    1023,
    0,
    4500,
    0,
    1.1,
    0.5,
    'RPM'
  );
  sHours = new DataPointType('hours',
    0,
    1000000000000,
    0,
    1000000000000,
    0,
    1.6,
    0.8,
    'H'
  );
  sLiquidFlow = new DataPointType('contatoreAcqua',
    0,
    1000000000000,
    0,
    1000000000000,
    0,
    22,
    0.8,
    'l'
  );
  sTemperature = new DataPointType('temperatura',
    0,
    1023,
    -200,
    600,
    20,
    15,
    0.8,
    '°C'
  );
  sLiquidLevel = new DataPointType('livelloAcqua',
    0,
    1023,
    0,
    2000,
    1400,
    10,
    0.8,
    'mm'
  );
  sRH = new DataPointType('umidità',
    0,
    1023,
    0,
    100,
    60,
    5,
    0.8,
    '%RH'
  );
  sPH = new DataPointType('pH',
    0,
    1023,
    0,
    14,
    7.3,
    4,
    0.8,
    'PH'
  );
  pompa1: DeviceClass = DeviceClass.newMotorCurrentRpmHours('Pompa 1',
    {maxI: 60, maxRPM: 4000, acceleration: .4, stress: 1} as DeviceConfigType,
    {state: SwitchState.OFF, I: 0, RPM: 0, H: 0} as DeviceParamType,
    DataPointType.fromTemplate(this.sCurrent, 5, 0),
    DataPointType.fromTemplate(this.sRPM, 6, 1),
    DataPointType.fromTemplate(this.sHours, 7, 2));

  pompa2: DeviceClass = DeviceClass.newMotorCurrentRpmHours('Pompa 2',
    {maxI: 60, maxRPM: 4000, acceleration: .4, stress: 0} as DeviceConfigType,
    {state: SwitchState.OFF, I: 0, RPM: 0, H: 0} as DeviceParamType,
    DataPointType.fromTemplate(this.sCurrent, 13, 3),
    DataPointType.fromTemplate(this.sRPM, 14, 4),
    DataPointType.fromTemplate(this.sHours, 15, 5));

  ventilatore1: DeviceClass = DeviceClass.newMotorCurrentRpmHours('Ventilatore 1',
    {maxI: 22, maxRPM: 1400, acceleration: .5, stress: 0} as DeviceConfigType,
    {state: SwitchState.OFF, I: 0, RPM: 0, H: 24} as DeviceParamType,
    DataPointType.fromTemplate(this.sCurrent, 21, 6),
    DataPointType.fromTemplate(this.sRPM, 22, 7),
    DataPointType.fromTemplate(this.sHours, 23, 8));


  motore1: DeviceClass = DeviceClass.newMotorCurrentRpmHours('Motore 1',
    {maxI: 90, maxRPM: 1800, acceleration: .8, stress: 0} as DeviceConfigType,
    {state: SwitchState.OFF, I: 0, RPM: 0, H: 24} as DeviceParamType,
    DataPointType.fromTemplate(this.sCurrent, 40, 9),
    DataPointType.fromTemplate(this.sRPM, 41, 10),
    DataPointType.fromTemplate(this.sHours, 42, 11));

  motore2: DeviceClass = DeviceClass.newMotorCurrentRpmHours('Motore 2',
    {maxI: 90, maxRPM: 1800, acceleration: .8, stress: 0} as DeviceConfigType,
    {state: SwitchState.OFF, I: 0, RPM: 0, H: 24} as DeviceParamType,
    DataPointType.fromTemplate(this.sCurrent, 44, 12),
    DataPointType.fromTemplate(this.sRPM, 45, 13),
    DataPointType.fromTemplate(this.sHours, 46, 14));

  vasca1: DeviceClass = DeviceClass.newPoolFlowTempLevel('Vasca 1',
    {tempMin: 4, tempMax: 96, tempSP: 20, flowRateIN: 100, flowRateOUT: 20, levelMax: 1800} as DeviceConfigType,
    {state: SwitchState.OFF, heatState: SwitchState.OFF, LiquidFlow: 0, Temperature: 48, LiquidLevel: 300} as DeviceParamType,
    DataPointType.fromTemplate(this.sLiquidFlow, 8, 15),
    DataPointType.fromTemplate(this.sTemperature, 9, 16),
    DataPointType.fromTemplate(this.sLiquidLevel, 10, 17));

  vasca2: DeviceClass = DeviceClass.newPoolFlowTempLevel('Vasca 2',
    {tempMin: 4, tempMax: 96, tempSP: 20, flowRateIN: 100, flowRateOUT: 20, levelMax: 1400} as DeviceConfigType,
    {state: SwitchState.OFF, heatState: SwitchState.OFF, LiquidFlow: 0, Temperature: 48, LiquidLevel: 100} as DeviceParamType,
    DataPointType.fromTemplate(this.sLiquidFlow, 16, 18),
    DataPointType.fromTemplate(this.sTemperature, 17, 19),
    DataPointType.fromTemplate(this.sLiquidLevel, 18, 20));

  vasca3: DeviceClass = DeviceClass.newPoolFlowTempRH('Vasca 3',
    {tempMin: 4, tempMax: 96, tempSP: 80, flowRateIN: 100, flowRateOUT: 100, rhMax: 0.7} as DeviceConfigType,
    {state: SwitchState.OFF, heatState: SwitchState.OFF, LiquidFlow: 0, Temperature: 48, RH: 0.5} as DeviceParamType,
    DataPointType.fromTemplate(this.sLiquidFlow, 24, 21),
    DataPointType.fromTemplate(this.sTemperature, 25, 22),
    DataPointType.fromTemplate(this.sRH, 26, 23));


  vasca4: DeviceClass = DeviceClass.newPoolLevelPH('Vasca 4',
    {levelMin: 200, levelMax: 1500, phMin: 9.0, phMax: 14.0, flowRateIN: 10, flowRateOUT: 10} as DeviceConfigType,
    {state: SwitchState.OFF, LiquidLevel: 1000, PH: 7.5} as DeviceParamType,
    DataPointType.fromTemplate(this.sLiquidLevel, 29, 24),
    DataPointType.fromTemplate(this.sPH, 30, 25));

  vasca5: DeviceClass = DeviceClass.newPoolLevelPH('Vasca 5',
    {levelMin: 200, levelMax: 1500, phMin: 7.0, phMax: 10.0, flowRateIN: 10, flowRateOUT: 10} as DeviceConfigType,
    {state: SwitchState.OFF, LiquidLevel: 1000, PH: 7.3} as DeviceParamType,
    DataPointType.fromTemplate(this.sLiquidLevel, 32, 26),
    DataPointType.fromTemplate(this.sPH, 33, 27));

  vasca6: DeviceClass = DeviceClass.newPoolLevelPH('Vasca 6',
    {levelMin: 200, levelMax: 1500, phMin: 6.5, phMax: 7.5, flowRateIN: 10, flowRateOUT: 10} as DeviceConfigType,
    {state: SwitchState.OFF, LiquidLevel: 1000, PH: 7.1} as DeviceParamType,
    DataPointType.fromTemplate(this.sLiquidLevel, 35, 28),
    DataPointType.fromTemplate(this.sPH, 36, 29));


  /**
   * node: ObjectType;
   * pompa1: Motor; // oggetto esterno di appoggio
   *
   * node.appendSensor(fromTemplate(sCurrent));
   * node.appendSensor(fromTemplate(sRPM));
   * node.appendSensor(fromTemplate(sHours));
   *
   * LogicIO.map(node.sensors(), pompa1.outputs(), [0,1,2])
   *
   */






  constructor(private logicIO: LogicIOService, private collector: CommDriverService) {

    /*
      lo scopo di quanto segue è spiegare come funziona la creazione di oggetti e sensori
      e la composizione dell'albero che descrive dell'impianto per comprendere come dal
      sensore si arriva alla generazione della measure.

      la procedura seguente permette di creare l'albero dell'impianto che dovrà
      essere esportato in un file JSON e costituisce la configurazione dell'impianto

      la struttura creata si basa sul pattern Composite secondo la descrizione che segue:
        nodo è un oggetto di tipo ObjectType
        ogni nodo può contenere altri nodi, cioè children di tipo ObjectType
        ogni nodo può avere sensors di tipo DataPointType (leaf)
        ogni nodo ha un parent di tipo ObjectType
        ogni sensor ha un parent di tipo ObjectType
        root il nodo più alto e non ha parent

      *** Creazione del nodo root:
      this.root = new ObjectType('root', 'plant', 1);

      *** Aggiunta di nodi
      ad un nodo può essere aggiunto un numero indefinito di nodi figli
        .appendObject(new ObjectType(name: 'Sezione lavaggio',
                                     tagName: 'section',
                                     tag: 2))

      .appendObject(...) restituisce il nodo a cui stiamo appendendo un figlio
        nodoR.appendObject(nodo1).appendObject(nodo2)
        appenderà nodo1 e nodo2 a nodoR e saranno entrambi children di nodoR

      .newObject() restituisce il nodo appena appeso
        nodoR.appendObject(nodo1).newObject.appendObject(nodo2)
        appenderà nodo1 a nodoR e nodo2 a nodo1

      .appendSensors() restituisce il nodo a cui sono stati aggiunti i sensori
      nodo1.appendSensors([
                            new DataPointType('current',
                                                ...
                                              ),
                            new DataPointType('rpm',
                                                ...
                                              ),
                            new DataPointType('hours',
                                                ...
                                              )
                          ])
      appende 3 sensori a nodo1 e restituisce nodo1


      ***************************************************************************
      ***   aggiunta di sensori appartenenti a devices creati in precedenza   ***
      ***************************************************************************

      la creazione di un device  dovrebbe restituire un'interfaccia universale ma
      è stata implementata come segue:
        motore2: DeviceClass = DeviceClass.newMotorCurrentRpmHours(name:     'Motore 2',
                                             config:   {maxI: 90, maxRPM: 1800, acceleration: .1} as DeviceConfigType,
                                             param:    {state: SwitchState.OFF, I: 1, RPM: 120, H: 24} as DeviceParamType,
                                             sCurrent: DataPointType.fromTemplate(sensor: this.sCurrent,
                                                                                  tag: 44,
                                                                                  map: 12),
                                             sRPM:     DataPointType.fromTemplate(sensor: this.sRPM,
                                                                                  tag: 45,
                                                                                  map: 13),
                                             sHours:   DataPointType.fromTemplate(sensor: this.sHours,
                                                                                  tag: 46,
                                                                                  map: 14));
        vasca6: Pool2Class =  new Pool2Class(name:     'Vasca 6',
                                             config:   {levelMin: 200, phMin: 7.0, phMax: 7.6} as PoolConfig2Type,
                                             param:    {state: SwitchState.OFF, LiquidLevel: 1000, PH: 7.1} as PoolParam2Type,
                                             sLiquidLevel: DataPointType.fromTemplate(this.sLiquidLevel, 35, 28),
                                             sPH:      DataPointType.fromTemplate(this.sPH, 36, 29));

      di seguito useremo <DeviceClass> dove qui abbiamo usato MotorClass o Pool2Class
      per ricordare che l'implementazione deve permettere il polimorfismo

      procedura:
        1.  creazione del device con definizione dei parametri dell'oggetto e
            dei parametri di mappatura
        2.  esecuzione della mappatura nel provider dei dati, di tipo LogicIO.service,
            cioè l'oggetto che simula i campi numerici corrispondenti agli ingressi
            del dispositivo fisico
        3.  creazione di una Measure che contiene i dati dei sensori
        4.  utilizzo dei sensori nell'albero impianto, identificati dalla Measure

      Il device è definito a livello di componente ma l'esecuzione della mappatura
      avviene qui, dove il LogicIO service è disponibile, la riga seguente:

        sensors = <DeviceClass>.map(logicIO)

      aseegna a sensors i sensori di <DeviceClass> di cui ha anche eseguito la mappatura
      nel LogicIO service

      il codice seguente:

        root.appendObject(new ObjectType('myNode1', 'section', 2))
          .newObject().hasMeasure('MyMeasure')
            .appendSensors(this.<myDevice>.map(logicIO))

        crea il nodo myNode1 a root,
          naviga fino a myNode1 e crea la misura MyMeasure
            mappa i sensori di myDevice e li arruola in myNode1

        da questo momento quando il servizio mqtt è in funzione la modifica dei dati dei
        sensori appartenenti a myNode1 comporta lo sparo della misura myMeasure

     */

    this.root = new ObjectType('root', 'plant', 1);
    this.root
      .appendObject(new ObjectType('Sezione lavaggio', 'section', 2))
      .newObject()
      .appendObject(new ObjectType('Prelavaggio', 'unit', 3))
      .newObject()
      .appendObject(new ObjectType('Pompa 1', 'device', 4))
      .newObject()
      .hasMeasure('ElMotor', MqttTopicPompa1)
      .appendSensors(this.pompa1.map(logicIO))
      .getParent()
      .hasMeasure('Pool1', MqttTopicVasca1)
      .appendSensors(this.vasca1.map(logicIO))
      .getParent()
      .getParent()
      .newObject()
      .appendObject(new ObjectType('Lavaggio', 'unit', 11))
      .newObject()
      .appendObject(new ObjectType('Pompa 2', 'device', 12))
      .newObject()
      .hasMeasure('ElMotor', MqttTopicPompa2)
      .appendSensors(this.pompa2.map(logicIO))
      .getParent()
      .hasMeasure('Pool1', MqttTopicVasca2)
      .appendSensors(this.vasca2.map(logicIO))
      .getParent()
      .getParent()
      .newObject()
      .appendObject(new ObjectType('Asciugatura', 'unit', 19))
      .newObject()
      .appendObject(new ObjectType('Ventilatore', 'device', 20))
      .newObject()
      .hasMeasure('ElMotor', MqttTopicVentilatore)
      .appendSensors(this.ventilatore1.map(logicIO))
      .getParent()
      .hasMeasure('Pool2', MqttTopicVasca3)
      .appendSensors(this.vasca3.map(logicIO))
      .getParent()
      .getParent()

      .appendObject(new ObjectType('Sezione pretrattamento', 'section', 27))
      .newObject()
      .appendObject(new ObjectType('Vasca pre trattamento', 'unit', 28))
      .newObject()
      .hasMeasure('Pool3', MqttTopicVasca4)
      .appendSensors(this.vasca4.map(logicIO))
      .getParent()
      .appendObject(new ObjectType('Vasca primer', 'unit', 31))
      .newObject()
      .hasMeasure('Pool3', MqttTopicVasca5)
      .appendSensors(this.vasca5.map(logicIO))
      .getParent()
      .appendObject(new ObjectType('Vasca finisher', 'unit', 34))
      .newObject()
      .hasMeasure('Pool3', MqttTopicVasca6)
      .appendSensors(this.vasca6.map(logicIO))
      .getParent().getParent()

      .appendObject(new ObjectType('Sezione stoccaggio', 'section', 37))
      .newObject()
      .appendObject(new ObjectType('Impilatore', 'unit', 38))
      .newObject()
      .appendObject(new ObjectType('Motore 1', 'device', 39))
      .newObject()
      .hasMeasure('ElMotor', MqttTopicMotore1)
      .appendSensors(this.motore1.map(logicIO))
      .getParent()
      .appendObject(new ObjectType('Motore 2', 'device', 43))
      .newObject()
      .hasMeasure('ElMotor', MqttTopicMotore2)
      .appendSensors(this.motore2.map(logicIO))
    ;
    /*    this.collector.loadPlant().subscribe((result) => {
          console.log('loaded plant ' + result);
          // this.root = result as ObjectType;
        });*/
  }

  ngOnInit() {

    if (false) {
      let o = new Object();
      o['root'] = this.root.serialize();
      /*      o['devices'] = [];
            o['devices'].push(this.pompa1.serialize());
            o['devices'].push(this.vasca1.serialize());
            o['devices'].push(this.pompa2.serialize());
            o['devices'].push(this.vasca2.serialize());
            o['devices'].push(this.ventilatore1.serialize());
            o['devices'].push(this.vasca3.serialize());
            o['devices'].push(this.vasca4.serialize());
            o['devices'].push(this.vasca5.serialize());
            o['devices'].push(this.vasca6.serialize());
            o['devices'].push(this.motore1.serialize());
            o['devices'].push(this.motore2.serialize());*/

      console.log(o);
      /*this.collector.savePlant(o).subscribe((result) => {
        console.log('saved plant ' + result);
      });*/
    }


    /*    let q = { 'measurement': 'Pool',
          'fields':
            [
              {'fldName': 'liqflow'}
            ],
          'tags':
            [
              {'tagName': 'section', 'value': 2},
              {'tagName': 'plant', 'value': 1}
            ],
          'type': {'name': 'avg',
            'startDate':  123445,
            'endDate':  456748458}
        };*/

    /*let query = new Query('ElMotor', 'last');
    query.addField('Hours');
    query.tags = this.root.getChild(0).getChild(0).getChild(0).getTags([]);

    let query2 = new Query('ElMotor', 'avg');
    query2.addField('Current');
    query2.tags = this.root.getChild(0).getChild(0).getChild(0).getTags([]);
    query.type.addParam( 'startDate',  Measure.getTimeStamp() - 10000);
    query.type.addParam( 'endDate',  Measure.getTimeStamp());


    this.collector.queryMeasure(query).subscribe( (result: Result) => {
      console.log('received query result ' + query.path);
      scanning (query.path)  {
        case '/plant/1/section/2/unit/3/device/4':
          this.pompa1.setDefaults('H', result.result[0].fields[0].Hours);
      }
      console.log(result);
    });

    this.collector.queryMeasure(query2).subscribe( (result) => {
      console.log('received query2');
      console.log(result);
    });*/
  }


  savePlant() {
    let o = new Object();
    o['root'] = this.root.serialize();
    console.log('save plant', o);
    this.collector.savePlant(o).subscribe((result) => {
      console.log('saved plant ' + result);
    });
  }

  deviceSwitch() {
    this.scanning = !this.scanning;
    // console.log('motor scanning ' + this.scanning);
    this.scanning ? this.logicIO.scanStart(0, 1000) : this.logicIO.scanStop();
  }
}
