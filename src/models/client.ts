export default class Client {
  id: number;
  name: string;
  dni: string;
  clientType: string;
  isDeleted: boolean;

  constructor(
    id: number,
    name: string,
    dni: string,
    clientType: string,
    isDeleted: boolean = false
  ) {
    this.id = id;
    this.name = name;
    this.dni = dni;
    this.clientType = clientType;
    this.isDeleted = isDeleted;
  }

  static empty(): Client {
    return new Client(0, "", "", "");
  }
}
