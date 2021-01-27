import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useChainMasteryState } from '../../context/ChainMasteryProvider';
import CustomColors from '../../styles/Colors';
import { StepAttempt } from '../../types/chain/StepAttempt';
import { DataVerificationControlCallback } from '../../types/DataVerificationControlCallback';
import ListItemSwitch from './ListItemSwitch';

interface DataVerificationListItemProps {
  stepAttempt: StepAttempt;
  onChange: DataVerificationControlCallback;
}

export const DataVerificationListItem = (props: DataVerificationListItemProps): JSX.Element => {
  const { stepAttempt, onChange } = props;
  const QUESTION_TYPES = {
    completion: 0,
    challBehav: 1,
  };
  const chainMasteryState = useChainMasteryState();

  // Runs once on mount
  useEffect(() => {
    let isCancelled = false;

    // Set step attempt default values
    if (!isCancelled && chainMasteryState.chainMastery) {
      console.log('DataVerificationListItem.tsx > useEffect');

      // Find the step in the draft session.
      chainMasteryState.chainMastery.draftSession.step_attempts.forEach((s, i) => {
        if (chainMasteryState.chainMastery && s.chain_step_id === stepAttempt.chain_step_id) {
          // Set its value.
          chainMasteryState.chainMastery.draftSession.step_attempts[i].completed = true;
          chainMasteryState.chainMastery.draftSession.step_attempts[i].had_challenging_behavior = false;
        }
      });
    }

    return () => {
      isCancelled = true;
    };
  }, []);

  const chainStepId = stepAttempt.chain_step_id !== undefined ? stepAttempt.chain_step_id : -1;
  const instruction = stepAttempt.chain_step ? stepAttempt.chain_step.instruction : 'LOADING';

  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>{`Step #${chainStepId + 1}: "${instruction}"`}</Text>
      <View style={styles.questionContainer}>
        <Text style={styles.question}>{`Was the task Completed?`}</Text>
        <ListItemSwitch
          name={'completed'}
          type={QUESTION_TYPES.completion}
          defaultValue={true}
          chainStepId={chainStepId}
          onChange={onChange}
        />
      </View>
      <View style={styles.questionContainer}>
        <Text style={styles.question}>{`Challenging Behavior?`}</Text>
        <ListItemSwitch
          name={'had_challenging_behavior'}
          type={QUESTION_TYPES.challBehav}
          defaultValue={false}
          chainStepId={chainStepId}
          onChange={onChange}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: CustomColors.uva.sky,
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: 10,
    paddingLeft: 20,
    margin: 5,
    marginLeft: 40,
    marginRight: 40,
    backgroundColor: CustomColors.uva.sky,
  },
  questionContainer: {
    flexDirection: 'row',
    alignContent: 'space-around',
    justifyContent: 'space-between',
    margin: 10,
    marginBottom: 10,
  },
  question: {
    fontSize: 24,
    fontWeight: '400',
    width: 300,
    alignSelf: 'center',
    color: '#000',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '600',
    paddingBottom: 10,
  },
  btnContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  yesNoBtn: {
    width: 144,
    margin: 5,
    marginLeft: 20,
    marginRight: 20,
  },
});
