import { Controller, Get, OnModuleInit, Param, Redirect, Render, Res } from '@nestjs/common';
import { runInThisContext } from 'vm';
import { DataService } from './data/data.service';

@Controller()
export class AppController {
  constructor(private data: DataService) { }
  all: boolean = false;
  onlyDel: boolean = false;
  ids: any[] = [];
  count: number = 0;
  title = 'Alphachecker';
  version = ' V1.1'
  @Get()
  @Render('index')
  async root() {
    await this.getData();
    this.all = false;
    return { all: this.all, title: this.title + this.version, ids: this.ids, count: this.count };
  }
  @Get('all')
  @Render('index')
  async rootAll() {
    await this.getData(true);
    this.all = true;
    return { all: this.all, title: this.title + this.version, ids: this.ids, count: this.count };
  }

  @Get('one/:id')
  @Render('one')
  async rootOne(@Param('id') id: string) {

    let item = await this.data.getId(id);

    return { title: 'Alphachecker: ' + id, data: item[0].data.data.hwinfo, id: item[0].id }
  }
  @Get('set/:id')
  @Redirect('/all')
  async setId(@Param('id') id: string) {
    await this.data.addKeyValueFromId(id, { marker: 'del' })
  }
  @Get('unset/:id')
  @Redirect('/all')
  async unsetId(@Param('id') id: string) {
    await this.data.removeKeyValueFromId(id, { marker: 'del' })
  }
  async getData(all: boolean = false) {
    this.ids = [];
    this.count = 0;
    (await this.data.getIds(all)).forEach((element) => {

      this.ids.push(element);
      this.count++;
    });
    this.ids.sort(this.compare);
  }

  compare(a, b) {
    if (a.id < b.id) {
      return -1;
    }
    if (a.id > b.id) {
      return 1;
    }
    return 0;
  }
}
