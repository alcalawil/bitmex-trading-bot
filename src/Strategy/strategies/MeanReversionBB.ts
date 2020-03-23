import StrategyBase from './StrategyBase';
import { IMarketData, IStrategyOrder, MarketSide, IBollingerOptions } from '@types';
import { logger } from '@shared';
import { BollingerSignal } from '../signalGenerators';
import { Trader } from '@trader';
import { bollingerBands } from '../indicators';
import { Order } from '@bitmexInterfaces';
import { v4 as uuidv4 } from 'uuid';
export class MeanReversionBB extends StrategyBase {
  private bollingerSignal: BollingerSignal;
  private trader: Trader;
  private bollingerOptions: IBollingerOptions;

  constructor(id: string, trader: Trader, expiration = 5000) {
    super(id, expiration);
    // TODO: Recibir estas options por config
    // Solo las estrategias pueden configurar los indicadores (no recibir options por constructor)
    this.bollingerOptions = {
      numberOfPeriods: 10,
      standardDeviations: 2,
    };
    this.bollingerSignal = new BollingerSignal(this.bollingerOptions);
    this.trader = trader;
  }

  async generateOrder(symbol: string, marketData: IMarketData): Promise<IStrategyOrder | null> {
    const bollingerAdvice = await this.bollingerSignal.advice(marketData);
    logger.debug(`BOLLINGER: ${bollingerAdvice}`);

    if (bollingerAdvice > 0.5) {
      // LONG
      logger.debug('>>> BUY LONG');
      const order: IStrategyOrder = {
        symbol,
        side: MarketSide.long,
        expiration: this.expiration,
      };
      return order;
    }

    if (bollingerAdvice < -0.5) {
      // Short
      logger.debug('>>> SELL SHORT');
      const order: IStrategyOrder = {
        symbol,
        side: MarketSide.short,
        expiration: this.expiration,
      };
      return order;
    }

    return null;
  }

  public async onStart({ candles, quotePrice }: IMarketData) {
    const { upperBand, lowerBand } = await bollingerBands(candles, this.bollingerOptions);

    const buyPrice = quotePrice.bid >  lowerBand[0] ? lowerBand[0] : undefined; // Undefined toma precio market
    const sellPrice = quotePrice.ask < upperBand[0] ? upperBand[0] : undefined;
    const amount = 1; // Recebir este parámetro de algun lado (config, params)
    const orderBuyId = uuidv4();
    const orderSellId = uuidv4();

    // TODO: guardar los id de las ordenes posteadas en el estado
    const orderBuy = await this.trader.postOrder({
      clOrdID: orderBuyId,
      symbol: 'XBTUSD',
      side: 'Buy',
      orderQty: amount,
      price: buyPrice,
    });
    logger.debug(
      `----- Order posted by onStart event - Id: ${orderBuyId}, PRICE: ${buyPrice} QTY: ${amount} SIDE: ${orderBuy.side}, TYPE: ${orderBuy.ordType}`,
    );

    const orderSell = await this.trader.postOrder({
      clOrdID: orderSellId,
      symbol: 'XBTUSD',
      side: 'Sell',
      orderQty: amount,
      price: sellPrice,
    });

    logger.debug(
      `----- Order posted by onStart event - Id: ${orderSellId}, PRICE: ${sellPrice} QTY: ${amount} SIDE: ${orderSell.side}, TYPE: ${orderSell.ordType}`,
    );

    return {
      orderBuy,
      orderSell,
    };
  }

  public async onFill(order: Order, { candles, quotePrice }: IMarketData) {
    // FIXME: NO postear MARKET orders, solo LIMIT, la market enseguida es filleada, entonces se vuelve a invocar a este
    // metodo y se vuelve a fillear una orden y así podría caer en un bucle infinito que colapse la memoria o haga que nos baneen
    logger.debug(`>> Fill event`);

    await this.trader.cancelAll();

    const { upperBand, lowerBand } = await bollingerBands(candles, this.bollingerOptions);

    logger.debug(`*** Order Filled side: ${order.side}`);
    const side = order.side === 'Buy' ? 'Sell' : 'Buy'; // Invierte el side
    logger.debug(`*** New Order side: ${side}`);
  
    const amount = 2; // TODO: En vez de hardcodear esto, debe ser el doble del amount del size de la position para que se invierta el la posicion y no solo se cierre
    const price = side === 'Buy' ? lowerBand[0] : upperBand[0];
    const orderId = uuidv4();

    const orderResponse = await this.trader.postOrder({
      clOrdID: orderId,
      symbol: 'XBTUSD',
      side: side,
      orderQty: amount,
      price,
    });

    logger.debug(
      `----- Order posted by onFill event - Id: ${orderId}, PRICE: ${price} QTY: ${amount} SIDE: ${orderResponse.side}, TYPE: ${orderResponse.ordType}`,
    );

    return orderResponse;
  }
  
  onCancel() {}

  onExpired() {}
}
