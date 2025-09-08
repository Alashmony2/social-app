import { Model } from "mongoose";

export abstract class AbstractRepository<T> {
  constructor(protected model: Model<T>) {}
  async create(item: T) {
    const doc = new this.model(item);
    return await doc.save;
  }
  getOne() {}
  update() {}
  delete() {}
}
