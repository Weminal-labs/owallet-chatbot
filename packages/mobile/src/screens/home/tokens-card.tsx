import { OWButton } from '@src/components/button';
import { OWEmpty } from '@src/components/empty';
import { Text } from '@src/components/text';
import { useTheme } from '@src/themes/theme-provider';
import { observer } from 'mobx-react-lite';
import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { SectionList, StyleSheet, View, ViewStyle } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { API } from '../../common/api';
import { CardBody, OWBox } from '../../components/card';
import { DownArrowIcon } from '../../components/icon';
import ProgressiveImage from '../../components/progessive-image';
import { useSmartNavigation } from '../../navigation.provider';
import { useStore } from '../../stores';
import { metrics, spacing, typography } from '../../themes';
import {
  capitalizedText,
  convertAmount,
  formatContractAddress,
  _keyExtract
} from '../../utils/helper';
import { TokenItem } from '../tokens/components/token-item';

export const TokensCard: FunctionComponent<{
  containerStyle?: ViewStyle;
  refreshDate: number;
}> = observer(({ containerStyle, refreshDate }) => {
  const { chainStore, queriesStore, accountStore, priceStore } = useStore();
  const account = accountStore.getAccount(chainStore.current.chainId);
  const { colors } = useTheme();
  const [nfts, setNFTs] = useState([]);
  const [tokens, setTokens] = useState([]);
  const styles = styling(colors);
  const smartNavigation = useSmartNavigation();
  const [index, setIndex] = useState<number>(0);
  // const [price, setPrice] = useState<object>({});
  const queryBalances = queriesStore
    .get(chainStore.current.chainId)
    .queryBalances.getQueryBech32Address(
      chainStore.current.networkType === 'evm'
        ? account.evmosHexAddress
        : account.bech32Address
    );

  useEffect(() => {
    const queryTokens = queryBalances.balances.concat(
      queryBalances.nonNativeBalances,
      queryBalances.positiveNativeUnstakables
    );

    const uniqTokens = [];
    queryTokens.map(token =>
      uniqTokens.filter(
        ut => ut.balance.currency.coinDenom == token.balance.currency.coinDenom
      ).length > 0
        ? null
        : uniqTokens.push(token)
    );

    setTokens(uniqTokens);
  }, [
    chainStore.current.chainId,
    account.bech32Address,
    account.evmosHexAddress,
    refreshDate
  ]);

  useEffect(() => {
    (async function get() {
      try {
        const res = await API.getNFTs(
          {
            address: account.bech32Address
          },
          {
            baseURL: 'https://api.airight.io/'
          }
        );

        setNFTs(res.data.items);
      } catch (error) {}
    })();
  }, [account.bech32Address]);

  const _renderFlatlistItem = ({ item }) => {
    console.log('item ===', item);

    return (
      <TouchableOpacity
        style={styles.flatListItem}
        onPress={() => {
          smartNavigation.navigateSmart('Nfts.Detail', { item });
        }}
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ProgressiveImage
            source={{
              uri: item.picture ?? item.url
            }}
            style={styles.itemPhoto}
            resizeMode="cover"
          />
        </View>

        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            marginTop: spacing['12'],
            alignItems: 'flex-start'
          }}
        >
          <Text style={styles.itemText}>
            {item.name.length > 11
              ? formatContractAddress(item.name)
              : item.name}
          </Text>

          {item.version === 1 ? (
            <Text
              style={{
                ...styles.itemText,
                color: colors['gray-300']
              }}
            >
              {item.offer
                ? `${convertAmount(item.offer.amount)} ${item.offer.denom}`
                : ''}
            </Text>
          ) : item.offer ? (
            <View>
              <Text
                style={{
                  ...styles.itemText,
                  color: colors['gray-300']
                }}
              >
                From {convertAmount(item.offer?.lowestPrice)}{' '}
                {item.offer?.denom}
              </Text>
              <Text
                style={{
                  ...styles.itemText,
                  color: colors['gray-300']
                }}
              >
                To {convertAmount(item.offer?.highestPrice)} {item.offer?.denom}
              </Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={containerStyle}>
      <OWBox
        style={{
          paddingTop: 12
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: metrics.screenWidth - 64
            // marginHorizontal: spacing['32']
          }}
        >
          {['Tokens', 'NFTs'].map((title: string, i: number) => (
            <View key={i}>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: spacing['12']
                }}
                onPress={() => {
                  setIndex(i);
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color:
                      index === i ? colors['primary-text'] : colors['gray-300']
                  }}
                >
                  {title}
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  width: 100,
                  height: 2,
                  marginTop: 8,
                  backgroundColor:
                    index === i ? colors['border'] : colors['primary']
                }}
              />
            </View>
          ))}
        </View>

        {index === 0 ? (
          <CardBody>
            {tokens?.length > 0 ? (
              tokens.slice(0, 3).map(token => {
                const priceBalance = priceStore.calculatePrice(token.balance);
                return (
                  <TokenItem
                    key={token.currency?.coinMinimalDenom}
                    chainInfo={{
                      stakeCurrency: chainStore.current.stakeCurrency,
                      networkType: chainStore.current.networkType
                    }}
                    balance={token.balance}
                    priceBalance={priceBalance}
                  />
                );
              })
            ) : (
              <OWEmpty />
            )}
          </CardBody>
        ) : (
          <CardBody>
            {nfts.length > 0 ? (
              <SectionList
                stickySectionHeadersEnabled={false}
                sections={[
                  {
                    title: 'NFTs',
                    data: nfts
                  }
                ]}
                renderSectionHeader={({ section }) => {
                  {
                    return (
                      <>
                        <View
                          style={{
                            marginTop: spacing['12'],
                            flexDirection: 'row'
                          }}
                        >
                          <Text style={styles.sectionHeader}>
                            {section.title}
                          </Text>
                          <DownArrowIcon
                            color={colors['text-title-login']}
                            height={12}
                          />
                        </View>

                        <FlatList
                          horizontal
                          data={section.data}
                          renderItem={_renderFlatlistItem}
                          keyExtractor={_keyExtract}
                          showsHorizontalScrollIndicator={false}
                        />
                      </>
                    );
                  }
                }}
                renderItem={() => <View />}
              />
            ) : (
              <OWEmpty />
            )}
          </CardBody>
        )}

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <OWButton
            label={capitalizedText('view all')}
            size="medium"
            type="secondary"
            onPress={() => {
              if (index === 0) {
                smartNavigation.navigateSmart('Tokens', {});
              } else {
                smartNavigation.navigateSmart('Nfts', { nfts });
              }
            }}
          />
        </View>
      </OWBox>
    </View>
  );
});

const styling = colors =>
  StyleSheet.create({
    textLoadMore: {
      ...typography['h7'],
      color: colors['colored-label']
    },
    containerBtn: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors['primary-background'],
      width: metrics.screenWidth - 48,
      height: spacing['40'],
      paddingVertical: spacing['10'],
      borderRadius: spacing['12']
    },
    sectionHeader: {
      ...typography.h7,
      // color: colors['gray-800'],
      marginBottom: spacing['8'],
      marginRight: spacing['10']
    },
    flatListItem: {
      backgroundColor: colors['background-box'],
      borderRadius: spacing['12'],
      width: (metrics.screenWidth - 60) / 2,
      marginRight: spacing['12'],
      padding: spacing['12']
    },
    itemPhoto: {
      // width: (metrics.screenWidth - 84) / 2,
      height: (metrics.screenWidth - 84) / 2,
      borderRadius: 10,
      marginHorizontal: 'auto',
      width: (metrics.screenWidth - 84) / 2
    },
    itemText: {
      ...typography.h7,
      // color: colors['gray-900'],
      fontWeight: '700'
    },
    transactionListEmpty: {
      justifyContent: 'center',
      alignItems: 'center'
    }
  });
