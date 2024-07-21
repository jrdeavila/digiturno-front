import Service from "./service";

export default class AttentionProfile {
  id: number;
  name: string;
  services: Service[];

  constructor(id: number, name: string, services: Service[]) {
    this.id = id;
    this.name = name;
    this.services = services;
  }
}
