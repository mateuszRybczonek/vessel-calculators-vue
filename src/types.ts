export interface Ref<T> {
  value: T
}

export type TableHeaderItem = {
  text: string;
  align: string;
  value: string;
}

export type Wellhead = {
  name: string;
  northing: number;
  easting: number;
  field: string;
  date: string;
  utmZone: number;
}

export type Beacon = {
  id: number;
  serialNo: string;
  northing: number;
  easting: number;
  floatNo: string;
  range: number;
  bearing: number;
}

export type BeaconsArray = {
  id: number;
  name: string;
  beacons: Beacon[];
}

export type BasicCalculationItem = {
  title: string;
  icon: string;
  value: number;
}

export type WellheadConfig = {
  startAngle: number;
  waterDepth: number;
  transponderHeight: number;
  transducerDepth: number;
  verticalAngle: number;
  beaconAngleTreshold: number;
}
