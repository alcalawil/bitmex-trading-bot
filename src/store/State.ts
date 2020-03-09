import { IState } from '@types';
import { EventEmitter } from 'events';

export class StateManager {
  private _state: IState;
  private _stateChanges: EventEmitter;
  public ready: Promise<any>;

  constructor() {
    this._state = {};

    this.ready = new Promise((resolve, reject) => {
      this.initializeState()
        .then(resolve)
        .catch(reject);
    });

    this._stateChanges = new EventEmitter();
  }

  private async initializeState() {
    return;
  }

  public get state() {
    return this._state;
  }
 
  public get stateChanges() {
    return this._stateChanges;
  }
}
