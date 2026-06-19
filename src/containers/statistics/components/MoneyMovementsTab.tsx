import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import AppBottomSheet from '../../../core/components/AppBottomSheet';
import { dateHelper } from '../../../helpers/dateHelper';
import { valuesHelper } from '../../../helpers/valuesHelper';
import { useMovementResum } from '../hooks/useMovementResum';
import { ReportMoneyMovement, StatisticsGroupBy } from '../services/statisticsService';
import styles from '../screens/StatisticsScreen.styles';

function formatHeader(created: string, groupBy: StatisticsGroupBy) {
  if (groupBy === 'month') {
    return dateHelper.formatHeaderMonthYearEs(created);
  }

  return `${dateHelper.getNameDay(created)} ${dateHelper.numberDay(created)}`.trim();
}

function AmountCell({
  value,
  direction,
}: {
  value: number;
  direction: 'down' | 'up';
}) {
  return (
    <View style={styles.moneyAmountBox}>
      <Text style={styles.moneyAmountText}>{valuesHelper.ifDecimalCeroGetIntegerQuantity(value)}</Text>
      <View style={styles.moneyArrowWrap}>
        <Image
          source={
            direction === 'down'
              ? require('../../../../assets/images/ui/downarrow2.png')
              : require('../../../../assets/images/ui/uparrow2.png')
          }
          style={styles.moneyArrow}
        />
      </View>
    </View>
  );
}

function CurrencyRow({
  flagSource,
  amountIn,
  amountOut,
}: {
  flagSource: any;
  amountIn: number;
  amountOut: number;
}) {
  return (
    <View style={styles.moneyValuesRow}>
      <View style={styles.moneyFlagWrap}>
        <Image source={flagSource} style={styles.moneyFlag} />
      </View>
      <View style={styles.moneyValuesHalf}>
        <AmountCell value={amountIn} direction="down" />
      </View>
      <View style={styles.moneyValuesHalf}>
        <AmountCell value={amountOut} direction="up" />
      </View>
    </View>
  );
}

function SectionTitle({
  icon,
  text,
}: {
  icon: any;
  text: string;
}) {
  return (
    <View style={styles.moneySectionTitleRow}>
      <View style={styles.moneySectionIconWrap}>
        <Image source={icon} style={styles.moneySectionIcon} />
      </View>
      <Text style={styles.moneySectionTitle}>{text}</Text>
    </View>
  );
}

function MoneyMovementCard({ item, groupBy }: { item: ReportMoneyMovement; groupBy: StatisticsGroupBy }) {
  return (
    <View style={styles.moneyCardWrap}>
      <View style={styles.gainHeaderChip}>
        <Text style={styles.gainHeaderChipText}>{formatHeader(item.created, groupBy)}</Text>
      </View>

      <View style={styles.moneyCard}>
        <View style={styles.moneyCardInner}>
          <SectionTitle icon={require('../../../../assets/images/ui/changeop.png')} text="cambio" />
          <CurrencyRow
            flagSource={require('../../../../assets/images/ui/flagfilerarg.png')}
            amountIn={item.amount_change_in}
            amountOut={item.amount_change_out}
          />
          <CurrencyRow
            flagSource={require('../../../../assets/images/ui/flagfiltest.png')}
            amountIn={item.amount_change_in_usd}
            amountOut={item.amount_change_out_usd}
          />

          <SectionTitle icon={require('../../../../assets/images/ui/check.png')} text="cheques" />
          <CurrencyRow
            flagSource={require('../../../../assets/images/ui/flagfilerarg.png')}
            amountIn={item.amount_check_in}
            amountOut={item.amount_check_out}
          />

          <SectionTitle icon={require('../../../../assets/images/ui/transfer.png')} text="trans" />
          <CurrencyRow
            flagSource={require('../../../../assets/images/ui/flagfilerarg.png')}
            amountIn={item.amount_transfer_in}
            amountOut={item.amount_transfer_out}
          />
          <CurrencyRow
            flagSource={require('../../../../assets/images/ui/flagfiltest.png')}
            amountIn={item.amount_transfer_in_usd}
            amountOut={item.amount_transfer_out_usd}
          />

          <SectionTitle icon={null} text="total" />
          <View style={styles.moneyTotalValuesRow}>
            <View style={styles.moneyFlagWrap}>
              <Image source={require('../../../../assets/images/ui/flagfilerarg.png')} style={styles.moneyFlag} />
            </View>
            <View style={styles.moneyPlainHalf}>
              <View style={styles.moneyPlainAmountWrap}>
                <Text style={styles.moneyAmountText}>{valuesHelper.ifDecimalCeroGetIntegerQuantity(item.tot_amount_in)}</Text>
              </View>
              <View style={styles.moneyArrowWrap}>
                <Image source={require('../../../../assets/images/ui/downarrow2.png')} style={styles.moneyArrow} />
              </View>
            </View>
            <View style={styles.moneyPlainHalf}>
              <View style={styles.moneyPlainAmountWrap}>
                <Text style={styles.moneyAmountText}>{valuesHelper.ifDecimalCeroGetIntegerQuantity(item.tot_amount_out)}</Text>
              </View>
              <View style={styles.moneyArrowWrap}>
                <Image source={require('../../../../assets/images/ui/uparrow2.png')} style={styles.moneyArrow} />
              </View>
            </View>
          </View>
          <View style={styles.moneyValuesRowLast}>
            <View style={styles.moneyFlagWrap}>
              <Image source={require('../../../../assets/images/ui/flagfiltest.png')} style={styles.moneyFlag} />
            </View>
            <View style={styles.moneyPlainHalf}>
              <View style={styles.moneyPlainAmountWrap}>
                <Text style={styles.moneyAmountText}>{valuesHelper.ifDecimalCeroGetIntegerQuantity(item.tot_amount_in_usd)}</Text>
              </View>
              <View style={styles.moneyArrowWrap}>
                <Image source={require('../../../../assets/images/ui/downarrow2.png')} style={styles.moneyArrow} />
              </View>
            </View>
            <View style={styles.moneyPlainHalf}>
              <View style={styles.moneyPlainAmountWrap}>
                <Text style={styles.moneyAmountText}>{valuesHelper.ifDecimalCeroGetIntegerQuantity(item.tot_amount_out_usd)}</Text>
              </View>
              <View style={styles.moneyArrowWrap}>
                <Image source={require('../../../../assets/images/ui/uparrow2.png')} style={styles.moneyArrow} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function MoneyMovementsTab() {
  const [groupBy, setGroupBy] = useState<StatisticsGroupBy>('day');
  const { items, loading, loadingMore, error, reload, loadMore } = useMovementResum(groupBy);
  const sheetHeight = 200;
  const sheetPeekHeight = 88;

  const data = useMemo(() => items, [items]);

  return (
    <View style={styles.gainScreen}>
      {loading && !data.length ? (
        <View style={styles.emptyWrap}>
          <ActivityIndicator size="small" color="#6f6392" />
        </View>
      ) : error && !data.length ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No se pudieron cargar los movimientos de dinero.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={reload} activeOpacity={0.8}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => `${item.created}-${index}`}
          renderItem={({ item }) => <MoneyMovementCard item={item} groupBy={groupBy} />}
          contentContainerStyle={styles.gainListContent}
          onEndReachedThreshold={0.3}
          onEndReached={() => loadMore()}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator size="small" color="#6f6392" />
              </View>
            ) : (
              <View style={styles.gainBottomSpace} />
            )
          }
        />
      )}

      <AppBottomSheet
        height={sheetHeight}
        peekHeight={sheetPeekHeight}
        arrowSource={require('../../../../assets/images/ui/arrowsan.png')}
        dragOn="both"
        containerStyle={styles.gainSwitchSheet}
        bodyStyle={styles.gainSwitchSheetBody}
      >
        <View style={styles.gainSwitchDock}>
          <TouchableOpacity
            style={styles.gainSwitchBtn}
            activeOpacity={0.85}
            onPress={() => setGroupBy('day')}
          >
            <View style={[styles.gainSwitchIconWrap, groupBy === 'day' ? styles.gainSwitchIconWrapActive : null]}>
              <Image
                source={require('../../../../assets/images/ui/buttonbshadow.png')}
                style={styles.gainSwitchIconBg}
              />
            </View>
            <Text style={[styles.gainSwitchText, groupBy === 'day' ? styles.gainSwitchTextActive : null]}>dia</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gainSwitchBtn}
            activeOpacity={0.85}
            onPress={() => setGroupBy('month')}
          >
            <View style={[styles.gainSwitchIconWrap, groupBy === 'month' ? styles.gainSwitchIconWrapActive : null]}>
              <Image
                source={require('../../../../assets/images/ui/buttonbshadow.png')}
                style={styles.gainSwitchIconBg}
              />
            </View>
            <Text style={[styles.gainSwitchText, groupBy === 'month' ? styles.gainSwitchTextActive : null]}>mes</Text>
          </TouchableOpacity>
        </View>
      </AppBottomSheet>
    </View>
  );
}
