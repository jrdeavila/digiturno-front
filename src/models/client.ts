export default class Client {
  id: number;
  name: string;
  dni: string;
  clientType: string;
  isDeleted: boolean;
  moduleName: string;

  constructor(
    id: number,
    name: string,
    dni: string,
    clientType: string,
    isDeleted: boolean = false,
    moduleName: string,
  ) {
    this.id = id;
    this.name = name;
    this.dni = dni;
    this.clientType = clientType;
    this.isDeleted = isDeleted;
    this.moduleName = moduleName;
  }

  static empty(): Client {
    return new Client(0, "", "", "", false, "");
  }
}
