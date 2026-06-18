import React, { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, SectionList, Text, TouchableOpacity, View } from 'react-native';
import AppTopBar from '../../../core/components/AppTopBar';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { useSideMenu } from '../../../core/navigation/SideMenuContext';
import { dateHelper } from '../../../helpers/dateHelper';
import CheckCard from '../components/CheckCard';
import CreateCheckTab from '../components/CreateCheckTab';
import { useChecks } from '../hooks/useChecks';
import { CheckState, ReportCheck } from '../services/checkService';
import styles from './ChecksScreen.styles';

type CheckTab = 'create' | 'pending' | 'approved';

type CheckSection = {
  title: string;
  dateKey: string;
  data: ReportCheck[];
};

function buildSections(checks: ReportCheck[], state: CheckState): CheckSection[] {
  const groups = new Map<string, ReportCheck[]>();

  checks.forEach((item) => {
    const rawDate = state === APP_CONSTANTS.STATE_DONE ? item.approve_date : item.operation_created;
    const dateKey = dateHelper.onlyDate(rawDate) || 'Sin fecha';
    if (!groups.has(dateKey)) groups.set(dateKey, []);
    groups.get(dateKey)?.push(item);
  });

  return Array.from(groups.entries()).map(([dateKey, data]) => ({
    title: dateKey === 'Sin fecha' ? dateKey : dateHelper.formatHeaderDateEs(dateKey),
    dateKey,
    data,
  }));
}

function ChecksList({ state }: { state: CheckState }) {
  const { checks, loading, loadingMore, error, reload, loadMore } = useChecks(state);

  const sections = useMemo(() => buildSections(checks, state), [checks, state]);

  if (loading && !checks.length) {
    return (
      <View style={styles.emptyWrap}>
        <ActivityIndicator size="small" color="#6f6392" />
      </View>
    );
  }

  if (error && !checks.length) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>No se pudieron cargar los cheques.</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={reload} activeOpacity={0.8}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!checks.length) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>
          {state === APP_CONSTANTS.STATE_PENDIENT
            ? 'No hay cheques pendientes para mostrar.'
            : 'No hay cheques aprobados para mostrar.'}
        </Text>
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => String(item.operation_id || item.check_detail_id)}
      contentContainerStyle={styles.listContent}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeaderWrap}>
          <View style={styles.sectionHeaderChip}>
            {section.dateKey === 'Sin fecha' ? (
              <Text style={styles.sectionHeaderText}>{section.title}</Text>
            ) : (
              <>
                <Text style={styles.sectionHeaderWeekdayText}>{dateHelper.getNameDay(section.dateKey)}</Text>
                <Text style={styles.sectionHeaderDayText}>{dateHelper.numberDay(section.dateKey)}</Text>
                <Text style={styles.sectionHeaderMonthText}>{dateHelper.getNameMonth2(section.dateKey)}</Text>
                <Text style={styles.sectionHeaderYearText}>{section.dateKey.slice(0, 4)}</Text>
              </>
            )}
          </View>
        </View>
      )}
      renderItem={({ item }) => <CheckCard item={item} state={state} onCheckChanged={reload} />}
      onEndReachedThreshold={0.3}
      onEndReached={() => loadMore()}
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.footerLoading}>
            <ActivityIndicator size="small" color="#6f6392" />
          </View>
        ) : null
      }
    />
  );
}

export default function ChecksScreen() {
  const navigation = useNavigation();
  const [tab, setTab] = useState<CheckTab>('pending');
  const [createRefreshKey, setCreateRefreshKey] = useState(0);

  return (
    <View style={styles.screen}>
      <AppTopBar title="Cheques" leftSymbol="←" onPressLeft={() => navigation.goBack()} />

      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'create' ? styles.tabBtnActive : null]}
          onPress={() => setTab('create')}
          activeOpacity={0.85}
        >
          <Text style={[styles.tabText, tab === 'create' ? styles.tabTextActive : null]}>crear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'pending' ? styles.tabBtnActive : null]}
          onPress={() => setTab('pending')}
          activeOpacity={0.85}
        >
          <Text style={[styles.tabText, tab === 'pending' ? styles.tabTextActive : null]}>pendientes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'approved' ? styles.tabBtnActive : null]}
          onPress={() => setTab('approved')}
          activeOpacity={0.85}
        >
          <Text style={[styles.tabText, tab === 'approved' ? styles.tabTextActive : null]}>aprobados</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {tab === 'create' ? (
          <CreateCheckTab
            key={createRefreshKey}
            onCreated={async () => {
              setCreateRefreshKey((prev) => prev + 1);
            }}
          />
        ) : tab === 'pending' ? (
          <ChecksList state={APP_CONSTANTS.STATE_PENDIENT} />
        ) : (
          <ChecksList state={APP_CONSTANTS.STATE_DONE} />
        )}
      </View>
    </View>
  );
}
