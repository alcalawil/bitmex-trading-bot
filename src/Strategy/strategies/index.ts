import { BuyCheap } from './BuyCheap';
import { MeanReversionBB } from './MeanReversionBB';
import StrategyBase from './StrategyBase';

const strategyInstances: StrategyBase[] = [];

export const strategyFactory = (strategyName: string): StrategyBase => {
  const strategyInstance = strategyInstances.find(instance => instance.id === strategyName);
  if (strategyInstance) {
    return strategyInstance;
  }

  const DEFAULT_EXPIRATION = 5000;
  switch (strategyName) {
    case BuyCheap.name:
      return new BuyCheap(BuyCheap.name, DEFAULT_EXPIRATION);
      break;

    case MeanReversionBB.name:
      return new MeanReversionBB(MeanReversionBB.name, DEFAULT_EXPIRATION);
      break;

    default:
      // La idea es que siempre retorne una estrategia por default. O capaz despues conviene modificarlo para lance una excepción
      return new BuyCheap(BuyCheap.name, DEFAULT_EXPIRATION);
      break;
  }
};
