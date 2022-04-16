import '../scss/app.scss';
import { Controller } from './modules/controller/Controller';

class Program {
  static Start () {
    new Controller().init();
  }
}

Program.Start();
