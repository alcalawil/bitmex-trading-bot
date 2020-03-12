import { BuyCheap } from './BuyCheap';
import StrategyBase from './StrategyBase';

export const strategyFactory = (strategyName: string): StrategyBase => {
  switch (strategyName) {
    case BuyCheap.name:
      const DEFAULT_EXPIRATION = 5000;
      return new BuyCheap(DEFAULT_EXPIRATION);
      break;

    default:
      // La idea es que siempre retorne una estrategia por default. O capaz despues conviene modificarlo para lance una excepción
      return new BuyCheap(5000);
      break;
  }
};
