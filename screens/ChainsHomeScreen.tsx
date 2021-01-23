import { useDeviceOrientation } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Text } from 'react-native-paper';
import {
  PROBE_INSTRUCTIONS,
  START_PROBE_SESSION_BTN,
  START_TRAINING_SESSION_BTN,
} from '../components/Chain/chainshome_text_assets/chainshome_text';
import ScorecardListItem from '../components/Chain/ScorecardListItem';
import SessionDataAside from '../components/Chain/SessionDataAside';
import AppHeader from '../components/Header/AppHeader';
import { Loading } from '../components/Loading/Loading';
import { ImageAssets } from '../data/images';
import { ApiService } from '../services/ApiService';
import { ChainMastery } from '../services/ChainMastery';
import CustomColors from '../styles/Colors';
import { ChainData, SkillstarChain } from '../types/chain/ChainData';
import { ChainSession, ChainSessionType, ChainSessionTypeLabels } from '../types/chain/ChainSession';
import { ChainStep } from '../types/chain/ChainStep';
import { MasteryInfo } from '../types/chain/MasteryLevel';
import { ChainStepStatus, StepAttempt } from '../types/chain/StepAttempt';
import { Participant } from '../types/User';

// Chain Home Screen
const ChainsHomeScreen = (): JSX.Element => {
  const navigation = useNavigation();
  const [asideContent, setAsideContents] = useState('');
  const [btnText, setBtnText] = useState<string>('');
  const [sessionNumber, setSessionNumber] = useState<number>(0);
  const [type, setType] = useState<ChainSessionType>();
  const { portrait } = useDeviceOrientation();
  const [participant, setParticipant] = useState<Participant>();
  const [chainSteps, setChainSteps] = useState<ChainStep[]>();
  const [chainData, setChainData] = useState<ChainData>();
  const [chainSession, setChainSession] = useState<ChainSession>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chainMastery, setChainMastery] = useState<ChainMastery>();

  /** LIFECYCLE METHODS */
  // Runs on load.
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled) {
        // Load selected participant
        if (!participant) {
          await ApiService.load<Participant>(
            'participant',
            ApiService.getSelectedParticipant,
            setParticipant,
            isCancelled,
          );
        }
      }
    };

    _load();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Runs when participant is updated.
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled) {
        // Load chain steps
        if (!chainSteps) {
          await ApiService.load<ChainStep[]>('chainSteps', ApiService.getChainSteps, setChainSteps, isCancelled);
        }

        // Load chain data
        if (!chainData) {
          await ApiService.load<ChainData>(
            'chainData',
            ApiService.getChainDataForSelectedParticipant,
            setChainData,
            isCancelled,
          );
        }
      }

      if (!isCancelled) {
        setIsLoading(false);
      }
    };

    _load();

    return () => {
      isCancelled = true;
    };
  }, [participant]);

  // Runs when chainData is updated.
  useEffect(() => {
    let isCancelled = false;
    const _load = async () => {
      if (chainSteps !== undefined && chainData != undefined && !isCancelled) {
        const mastery = new ChainMastery(chainSteps, chainData);
        setChainMastery(mastery);

        if (chainData.sessions && chainData.sessions.length > 0) {
          const lastSession = chainData.sessions[chainData.sessions.length - 1];
          await ApiService.contextDispatch({
            type: 'session',
            payload: lastSession,
          });

          if (!isCancelled) {
            setChainSession(lastSession);
            setSessionNumber(chainData.sessions.length);
          }
        } else if (chainSteps && chainSteps.length > 0) {
          console.log('Creating a new session.');
          const newChainSession: ChainSession = {
            session_type: ChainSessionType.training,
            date: new Date(),
            completed: false,
            step_attempts: chainSteps.map(s => {
              return {
                chain_step_id: s.id,
                chain_step: s,
                completed: false,
                status: ChainStepStatus.not_complete,
              } as StepAttempt;
            }),
          };

          if (!isCancelled) {
            setChainSession(newChainSession);
          }
          const newChainData = new ChainData(chainData);
          newChainData.sessions.push(newChainSession);
          const dbChainData = await ApiService.upsertChainData(newChainData);

          if (dbChainData && !isCancelled) {
            setChainData(new ChainData(dbChainData));
          }
          setSessionNumber(1);
        }
      }
    };

    const _setSessionTypeAndNmbr = async () => {
      if (!(chainData && chainMastery && chainMastery.masteryInfoMap)) {
        return;
      }

      if (chainMastery.previousSession && !isCancelled) {
        if (chainMastery.previousSession.session_type === ChainSessionType.training) {
          setType(ChainSessionType.training);
          setSessionNumber(chainData.sessions.length + 1);
          await ApiService.contextDispatch({ type: 'sessionNumber', payload: sessionNumber });
          await ApiService.contextDispatch({ type: 'sessionType', payload: 'training' });
          setBtnText(START_TRAINING_SESSION_BTN);
        } else if (chainMastery.previousSession.session_type === ChainSessionType.probe) {
          setType(ChainSessionType.probe);
          setSessionNumber(chainData.sessions.length + 1);
          await ApiService.contextDispatch({ type: 'sessionNumber', payload: sessionNumber });
          await ApiService.contextDispatch({ type: 'sessionType', payload: 'probe' });
          setBtnText(START_PROBE_SESSION_BTN);
          setAsideContents(PROBE_INSTRUCTIONS);
        }
      } else if (!isCancelled) {
        setSessionNumber(1);
        setType(ChainSessionType.probe);
        setBtnText(START_PROBE_SESSION_BTN);
        setAsideContents(PROBE_INSTRUCTIONS);

        // Session count (how many sessions attempted)
        // i.e., sessions with attempts. Sessions with no attempts would not be included in this count?
        await ApiService.contextDispatch({ type: 'sessionNumber', payload: 1 });

        // chainData.sessions[i].session_type
        await ApiService.contextDispatch({ type: 'sessionType', payload: 'probe' });
      }
    };

    _load().then(() => {
      _setSessionTypeAndNmbr();
    });
    return () => {
      isCancelled = true;
    };
  }, [chainData]);

  // Runs when participant and/or device orientation is changed.
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (participant && (!chainData || (chainData && chainData.id === undefined))) {
        // Check that the current participant has chain data. If not, add it.
        const dbData = await ApiService.getChainDataForSelectedParticipant();

        if (!dbData || (dbData && dbData.id === undefined)) {
          const newData: SkillstarChain = {
            participant_id: participant.id,
            sessions: [],
          };

          try {
            const newDbData = await ApiService.addChainData(newData);
            if (!isCancelled && newDbData) {
              const newChainData = new ChainData(newDbData);
              //   console.log('newChainData added for participant');
              await ApiService.contextDispatch({ type: 'chainData', payload: newChainData });
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
    };

    if (!isCancelled && !isLoading) {
      _load();
    }

    return () => {
      isCancelled = true;
    };
  }, [participant, portrait]);
  /** END LIFECYCLE METHODS */

  const navToProbeOrTraining = () => {
    navigation.navigate('PrepareMaterialsScreen');
  };

  const key = chainData ? chainData.participant_id : -1;
  const chainSessionId = chainSession && chainSession.id !== undefined ? chainSession.id : -1;

  function _getMasteryInfo(chainData: ChainData, chainStepId: number) {
    return { chainStepId: chainStepId, stepStatus: ChainStepStatus.not_complete } as MasteryInfo;
  }

  return (
    <ImageBackground
      key={'chains_home_sreen_' + key}
      source={ImageAssets.sunrise_muted}
      resizeMode={'cover'}
      style={styles.bkgrdImage}
    >
      <View style={portrait ? styles.container : styles.landscapeContainer}>
        <AppHeader
          name={'Chains Home'}
          onParticipantChange={selectedParticipant => {
            setIsLoading(true);
            setParticipant(selectedParticipant);
          }}
        />
        {!isLoading && chainSteps && chainData ? (
          <View style={styles.listContainer}>
            <SessionDataAside asideContent={asideContent} />
            {chainSteps && (
              <ScrollView style={styles.list}>
                {chainSteps.map(chainStep => {
                  return chainData ? (
                    <ScorecardListItem
                      key={'scorecard_list_chain_step_' + chainStep.id}
                      chainStep={chainStep}
                      stepAttempt={chainData.getStep(chainSessionId, chainStep.id)}
                      masteryInfo={_getMasteryInfo(chainData, chainStep.id)}
                    />
                  ) : (
                    <Text>Error</Text>
                  );
                })}
              </ScrollView>
            )}
          </View>
        ) : (
          <Loading />
        )}
        {btnText ? (
          <TouchableOpacity style={[styles.startSessionBtn, { marginBottom: 0 }]} onPress={navToProbeOrTraining}>
            <Animatable.Text animation={'bounceIn'} duration={2000} style={styles.btnText}>
              {btnText}
            </Animatable.Text>
          </TouchableOpacity>
        ) : (
          <Loading />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bkgrdImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    margin: 0,
    justifyContent: 'space-between',
    alignContent: 'flex-start',
    padding: 10,
    paddingBottom: 80,
  },
  landscapeContainer: {
    flex: 1,
    margin: 0,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    padding: 10,
    paddingBottom: 80,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingLeft: 20,
    alignSelf: 'flex-start',
  },
  separator: {
    marginVertical: 30,
    height: 1,
  },
  listContainer: {
    height: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255,0.4)',
    padding: 5,
    margin: 5,
    marginTop: 12,
  },
  list: {
    margin: 5,
    marginBottom: 4,
    padding: 5,
    paddingBottom: 30,
  },
  listItem: {
    height: 60,
  },
  startSessionBtn: {
    width: '90%',
    alignSelf: 'center',
    margin: 10,
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: CustomColors.uva.orange,
  },
  btnText: {
    textAlign: 'center',
    color: CustomColors.uva.white,
    fontSize: 32,
    fontWeight: '500',
  },
});

export default ChainsHomeScreen;
