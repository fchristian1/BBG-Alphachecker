import { Inject, Injectable } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import { Key } from 'readline';

@Injectable()
export class DataService {
  constructor(@Inject('DATABASE_CONNECTION') private db: Db) { }

  async getIds(all: boolean = false): Promise<any[]> {
    if (all) {
      return await this.db
        .collection('pcdata')
        .find({})
        .project({ _id: 1, id: 1, date: 1, marker: 1 })
        .toArray();
    } else {
      return await this.db
        .collection('pcdata')
        .find({ marker: { $ne: 'del' } })
        .project({ id: 1 })
        .toArray();
    }
  }
  getId(id: string) {
    let _id = new ObjectId(id);
    return this.db
      .collection('pcdata')
      .find({ _id })
      .toArray()
  }
  async addKeyValueFromId(id: string, data: object) {
    return this.db.collection('pcdata')
      .updateOne({ _id: new ObjectId(id) }, { $set: data })
  }
  async removeKeyValueFromId(id: string, data: object) {
    return this.db.collection('pcdata')
      .updateOne({ _id: new ObjectId(id) }, { $unset: data })
  }
}
