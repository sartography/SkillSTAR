import date from 'date-and-time';
import React, { useEffect, useState } from 'react';
import { LayoutRectangle, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-paper';
import { useChainMasteryState } from '../../context/ChainMasteryProvider';
import CustomColors from '../../styles/Colors';
import { ChainSessionType } from '../../types/chain/ChainSession';
import GraphModal from '../DataGraph/GraphModal';
import { ChainsHomeGraph } from '../DataGraph/index';
import { Loading } from '../Loading/Loading';
import { ProbeAside, TrainingAside } from './index';

interface SessionDataAsideProps {
  asideContent: string;
}

/**
 * NEEDS:
 * ** Session type: Probe or Training,
 * ** today's FOCUS STEP (instructions, stepnumber)
 * ** today's PROMPT LEVEL
 * **
 */

const SessionDataAside = (props: SessionDataAsideProps): JSX.Element => {
  const [isTraining, setIsTraining] = useState(false);
  const [graphContainerDimens, setGraphContainerDimens] = useState<LayoutRectangle>();
  const [modalVis, setModalVis] = useState(false);
  const [sessionNumber, setSessionNumber] = useState<number>(0);
  const { asideContent } = props;
  const chainMasteryState = useChainMasteryState();

  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled) {
        if (
          !isCancelled &&
          chainMasteryState.chainMastery &&
          chainMasteryState.chainMastery.draftSession &&
          chainMasteryState.chainMastery.draftSession.session_type === ChainSessionType.training
        ) {
          setSessionNumber(chainMasteryState.chainMastery.chainData.sessions.length);
          setIsTraining(true);
        }
      }
    };

    _load();

    return () => {
      isCancelled = true;
    };
  });

  const handleModal = () => {
    setModalVis(!modalVis);
  };

  const setAsideContent = () => {
    if (isTraining && chainMasteryState.chainMastery && chainMasteryState.chainMastery.draftSession) {
      const stepAttempt = chainMasteryState.chainMastery.draftSession.step_attempts[0];
      return (
        <TrainingAside
          sessionType={stepAttempt.session_type}
          stepAttempt={stepAttempt}
          promptLevel={stepAttempt.target_prompt_level}
          asideContent={asideContent}
        />
      );
    } else {
      return <ProbeAside />;
    }
  };

  return chainMasteryState.chainMastery &&
    chainMasteryState.chainMastery.draftSession &&
    chainMasteryState.chainMastery.draftSession.date ? (
    <View style={styles.container}>
      <GraphModal visible={modalVis} handleVis={handleModal} />
      <View>
        <View>
          <Card>
            <View style={styles.sessionNumbAndDateContainer}>
              <Text style={styles.sessionNum}>{`Session #${sessionNumber}`}</Text>
              <Text style={styles.date}>
                {date.format(chainMasteryState.chainMastery.draftSession.date, 'MM/DD/YYYY')}
              </Text>
            </View>
            <View style={styles.taskInfoContainer}>{setAsideContent()}</View>
          </Card>
        </View>
        <View
          style={styles.graphIconContainer}
          onLayout={e => {
            const dimensions = e.nativeEvent.layout;
            setGraphContainerDimens(dimensions);
          }}
        >
          <Card>
            <ChainsHomeGraph dimensions={graphContainerDimens} />
            <TouchableOpacity
              onPress={() => {
                setModalVis(true);
              }}
            >
              <Text style={styles.graphText}>{`View your progress`}</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </View>
    </View>
  ) : (
    <Loading />
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    marginLeft: 10,
    padding: 10,
    borderRadius: 10,
    fontSize: 22,
  },
  subContainer: {
    marginTop: 0,
    flexDirection: 'row',
  },
  sessionNumbAndDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    padding: 10,
  },
  date: {
    fontSize: 18,
    fontWeight: '600',
  },
  sessionNum: {
    fontWeight: '600',
    fontSize: 18,
  },
  taskInfoContainer: {
    padding: 10,
  },
  isProbeTrainingSession: {
    fontWeight: '600',
    fontSize: 18,
    padding: 5,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: CustomColors.uva.grayMedium,
  },
  upNextContainer: { padding: 10 },
  upNextLabel: {
    fontWeight: '600',
    fontSize: 18,
  },
  focusStep: {
    fontWeight: '600',
    fontSize: 18,
    padding: 2,
    paddingLeft: 10,
  },
  focusStepInstruction: {
    fontWeight: '400',
  },
  promptLevelLabel: {
    fontWeight: '600',
    fontSize: 18,
    padding: 2,
    paddingLeft: 10,
  },
  promptLevel: {
    fontWeight: '400',
    fontSize: 18,
    padding: 2,
    paddingLeft: 10,
  },
  masteryLevelLabel: {
    fontWeight: '600',
    fontSize: 18,
    padding: 2,
    paddingLeft: 10,
  },
  masteryLevel: {
    fontWeight: '400',
    fontSize: 18,
    padding: 2,
    paddingLeft: 10,
  },
  moreDetailsBtn: {
    padding: 1,
    margin: 10,
  },
  graphIconContainer: {
    width: 280,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  graphText: {
    fontSize: 18,
    color: CustomColors.uva.grayDark,
    alignSelf: 'center',
    padding: 5,
  },
});

export default SessionDataAside;
