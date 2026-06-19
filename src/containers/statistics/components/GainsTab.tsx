import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import AppBottomSheet from '../../../core/components/AppBottomSheet';
import { dateHelper } from '../../../helpers/dateHelper';
import { valuesHelper } from '../../../helpers/valuesHelper';
import { useDayResum } from '../hooks/useDayResum';
import { ReportSumBuySaleDay, StatisticsGroupBy } from '../services/statisticsService';
import styles from '../screens/StatisticsScreen.styles';

function GainDotDivider() {
  return (
    <View style={styles.gainDetailDotDivider}>
      {Array.from({ length: 8.5 }).map((_, index) => (
        <View key={index} style={styles.gainDetailDotDividerDot} />
      ))}
    </View>
  );
}

function formatHeader(created: string, groupBy: StatisticsGroupBy) {
  if (groupBy === 'month') {
    return dateHelper.formatHeaderMonthYearEs(created);
  }

  return `${dateHelper.getNameDay(created)} ${dateHelper.numberDay(created)}`.trim();
}

function GainCard({ item, groupBy }: { item: ReportSumBuySaleDay; groupBy: StatisticsGroupBy }) {
  const average = item.ppc > 0 && item.ppv > 0 ? (item.ppc + item.ppv) / 2 : 0;
  const spreadUsd = average > 0 ? (item.ppv - item.ppc) / average : 0;
  const spread = item.ppv - item.ppc;

  const changeGain =
    item.result_sales > 0 && item.result_buys > 0
      ? Math.min(item.result_sales, item.result_buys) * spreadUsd
      : 0;

  const checksUsd = average > 0 ? item.amount_checks / average : 0;
  const transfersUsd = average > 0
    ? item.amount_transfers_usd + (item.amount_transfers / average)
    : 0;
  const totalOutcomes = average > 0
    ? item.outcomes_usd + (item.outcomes_ars / average)
    : 0;

  const total = average > 0 ? checksUsd + transfersUsd + changeGain - totalOutcomes : 0;
  const title = groupBy === 'month' ? 'Ganancia mensual' : 'Ganancia diaria';
  const vrd = average > 0 ? `vrd (${valuesHelper.ifDecimalCeroGetIntegerQuantity(average)})` : 'vrd (sin valor)';

  return (
    <View style={styles.gainCardWrap}>
      <View style={styles.gainHeaderChip}>
        <Text style={styles.gainHeaderChipText}>{formatHeader(item.created, groupBy)}</Text>
      </View>

      <View style={styles.gainCard}>
        <View style={styles.gainTopRow}>
          <Image source={require('../../../../assets/images/ui/flagfiltest.png')} style={styles.gainFlag} />
          <View style={styles.gainTopHalf}>
            <Text style={styles.gainTopLabel}>compras</Text>
            <View style={styles.gainValueBox}>
              <Text style={styles.gainValueBoxText}>{valuesHelper.ifDecimalCeroGetIntegerQuantity(item.result_buys)}</Text>
            </View>
          </View>
          <View style={styles.gainTopHalf}>
            <Text style={styles.gainTopLabel}>ventas</Text>
            <View style={styles.gainValueBox}>
              <Text style={styles.gainValueBoxText}>{valuesHelper.ifDecimalCeroGetIntegerQuantity(item.result_sales)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.gainTopRowSecondary}>
          <Image source={require('../../../../assets/images/ui/flagfilerarg.png')} style={styles.gainFlag} />
          <View style={styles.gainTripleValueWrap}>
            <Text style={styles.gainTopLabel}>ppc</Text>
            <View style={styles.gainValueBox}>
              <Text style={styles.gainValueBoxText}>{valuesHelper.ifDecimalCeroGetIntegerQuantity(item.ppc)}</Text>
            </View>
          </View>
          <View style={styles.gainTripleMiddleWrap}>
            <Text style={styles.gainTopLabel}>spread</Text>
            <Text style={styles.gainSpreadText}>{valuesHelper.getBigNumb(spread)}</Text>
          </View>
          <View style={styles.gainTripleValueWrap}>
            <Text style={styles.gainTopLabel}>ppv</Text>
            <View style={styles.gainValueBox}>
              <Text style={styles.gainValueBoxText}>{valuesHelper.ifDecimalCeroGetIntegerQuantity(item.ppv)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.gainTitleRow}>
          <Text style={styles.gainTitle}>{title}</Text>
          <View style={styles.gainVrdWrap}>
            <Text style={styles.gainVrdText}>{vrd}</Text>
            <Image source={require('../../../../assets/images/ui/flagfiltest.png')} style={styles.gainVrdFlag} />
          </View>
        </View>

        <View style={styles.gainDetailCard}>
          <View style={styles.gainDetailRow}>
            <View style={styles.gainDetailLeft}>
              <Image source={require('../../../../assets/images/ui/changeop.png')} style={styles.gainDetailIcon} />
              <Text style={styles.gainDetailText}>cambio</Text>
            </View>
            <GainDotDivider />
            <Text style={styles.gainDetailValue}>{valuesHelper.ifDecimalCeroGetIntegerQuantity(changeGain)}</Text>
          </View>

          <View style={styles.gainDetailRow}>
            <View style={styles.gainDetailLeft}>
              <Image source={require('../../../../assets/images/ui/check.png')} style={styles.gainDetailIcon} />
              <Text style={styles.gainDetailText}>cheques</Text>
            </View>
            <GainDotDivider />
            <Text style={styles.gainDetailValue}>{average > 0 ? valuesHelper.ifDecimalCeroGetIntegerQuantity(checksUsd) : '0'}</Text>
          </View>

          <View style={styles.gainDetailRow}>
            <View style={styles.gainDetailLeft}>
              <Image source={require('../../../../assets/images/ui/transfer.png')} style={styles.gainDetailIcon} />
              <Text style={styles.gainDetailText}>transferencias</Text>
            </View>
            <GainDotDivider />
            <Text style={styles.gainDetailValue}>{average > 0 ? valuesHelper.ifDecimalCeroGetIntegerQuantity(transfersUsd) : '0'}</Text>
          </View>

          <View style={styles.gainDetailRow}>
            <View style={styles.gainDetailLeft}>
              <View style={styles.gainDetailIconSpacer} />
              <Text style={styles.gainExpenseText}>gastos</Text>
            </View>
            <GainDotDivider />
            <Text style={styles.gainExpenseValue}>
              {average > 0 ? `(${valuesHelper.ifDecimalCeroGetIntegerQuantity(totalOutcomes)})` : '0'}
            </Text>
          </View>

          <View style={styles.gainTotalRow}>
            <Text style={styles.gainTotalLabel}>total</Text>
            <Text style={styles.gainTotalValue}>{average > 0 ? valuesHelper.ifDecimalCeroGetIntegerQuantity(total) : ''}</Text>
          </View>
        </View>

        {groupBy === 'month' ? (
          <View style={styles.gainCompareRow}>
            <Image source={require('../../../../assets/images/ui/bal2.png')} style={styles.gainCompareIcon} />
            <Text style={styles.gainCompareLabel}>comparativa balance</Text>
            <Text style={styles.gainCompareValue}>
              {valuesHelper.ifDecimalCeroGetIntegerQuantity(item.amount_balance_gain)}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

export default function GainsTab() {
  const [groupBy, setGroupBy] = useState<StatisticsGroupBy>('day');
  const { items, loading, loadingMore, error, reload, loadMore } = useDayResum(groupBy);
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
          <Text style={styles.emptyText}>No se pudieron cargar las ganancias.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={reload} activeOpacity={0.8}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => `${item.created}-${index}`}
          renderItem={({ item }) => <GainCard item={item} groupBy={groupBy} />}
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
