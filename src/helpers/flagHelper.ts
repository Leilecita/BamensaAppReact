import { ImageSourcePropType } from 'react-native';

type CoinLike = {
 id: number;
 name?: string;
 short_name?: string;
};

const DEFAULT_SHORT_NAME = 'ARS';

const IMAGE_FLAG_BY_SHORT_NAME: Record<string, ImageSourcePropType> = {
 ARS: require('../../assets/images/ui/arg.png'),
 URU: require('../../assets/images/ui/uru.png'),
 USD: require('../../assets/images/ui/uni.png'),
 BRA: require('../../assets/images/ui/bra.png'),
 CHI: require('../../assets/images/ui/chi.png'),
 EUR: require('../../assets/images/ui/europe.png'),
 LIB: require('../../assets/images/ui/reinun.png'),
 USDT: require('../../assets/images/ui/tether.png'),
};

const IMAGE_FILTER_FLAG_BY_SHORT_NAME: Record<string, ImageSourcePropType> = {
 ARS: require('../../assets/images/ui/flagfilerarg.png'),
 URU: require('../../assets/images/ui/urug.png'),
 USD: require('../../assets/images/ui/flagfiltest.png'),
 BRA: require('../../assets/images/ui/flagfiltbra.png'),
 CHI: require('../../assets/images/ui/flagfiltch.png'),
 EUR: require('../../assets/images/ui/eurround.png'),
 LIB: require('../../assets/images/ui/reinounido.png'),
 USDT: require('../../assets/images/ui/tether.png'),
};

class FlagHelper {
 private static instance: FlagHelper = new FlagHelper();
 private coins: CoinLike[] = [];

 private constructor() {}

 static get(): FlagHelper {
  return FlagHelper.instance;
 }

 setCoins(coins: CoinLike[]): void {
  this.coins = coins;
 }

 getCoins(): CoinLike[] {
  return this.coins;
 }

 getId(shortName: string, coins: CoinLike[] = this.coins): number {
  const coin = coins.find((item) => item?.short_name === shortName);
  return coin?.id ?? -1;
 }

 getShortName(id: number): string {
  const coin = this.coins.find((item) => item?.id === id);
  return coin?.short_name ?? DEFAULT_SHORT_NAME;
 }

 getPositionAdapter(shortName: string, coins: CoinLike[] = this.coins): number {
  return coins.findIndex((item) => item?.short_name === shortName);
 }

 createArrayCoins(list: CoinLike[]): string[] {
  return list
   .filter((item) => item?.short_name)
   .map((item) => item.short_name as string);
 }

 createFlags(list: CoinLike[]): ImageSourcePropType[] {
  return list
   .filter((item) => item?.short_name)
   .map((item) => this.getImageFlagSource(item.short_name as string));
 }

 getImageFlagSource(shortName: string): ImageSourcePropType {
  return IMAGE_FLAG_BY_SHORT_NAME[shortName] ?? IMAGE_FLAG_BY_SHORT_NAME[DEFAULT_SHORT_NAME];
 }

 getImageFilterFlagSource(shortName: string): ImageSourcePropType {
  return (
   IMAGE_FILTER_FLAG_BY_SHORT_NAME[shortName] ??
   IMAGE_FILTER_FLAG_BY_SHORT_NAME[DEFAULT_SHORT_NAME]
  );
 }
}

export const flagHelper = FlagHelper.get();

export const getFlagSourceByShortName = (shortName: string): ImageSourcePropType =>
 flagHelper.getImageFlagSource(shortName);

export const getFilterFlagSourceByShortName = (shortName: string): ImageSourcePropType =>
 flagHelper.getImageFilterFlagSource(shortName);

export default FlagHelper;
