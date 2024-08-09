export default class ClientType {
  id: number;
  name: string;
  slug: string;

  constructor(id: number, name: string, slug: string) {
    this.id = id;
    this.name = name;
    this.slug = slug;
  }
}
