import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { RadioButton } from 'react-native-paper';
import { randomId } from '../../_util/RandomId';
import { useChainMasteryState } from '../../context/ChainMasteryProvider';
import { ChainMastery } from '../../services/ChainMastery';
import CustomColors from '../../styles/Colors';
import { ChainStepPromptLevel, ChainStepPromptLevelMap, StepAttempt } from '../../types/chain/StepAttempt';

interface PromptAccordionProps {
  chainStepId: number;
  completed: boolean;
}

const PromptAccordion = (props: PromptAccordionProps): JSX.Element => {
  const { chainStepId, completed } = props;
  const [checked, setChecked] = useState<number>();
  const chainMasteryState = useChainMasteryState();

  /**
   * BEGIN: Lifecycle methods
   */
  // Runs when completed is changed
  useEffect(() => {
    let isCancelled = false;

    const _load = async () => {
      if (!isCancelled && completed !== undefined) {
        if (chainMasteryState.chainMastery && chainStepId !== undefined) {
          const stateStepAttempt = chainMasteryState.chainMastery.getDraftSessionStep(chainStepId);
          determineDefaultCheckedValue(stateStepAttempt);
        }
      }
    };

    if (!isCancelled) {
      _load();
    }

    return () => {
      isCancelled = true;
    };
  }, [completed]);
  /**
   * END: Lifecycle methods
   */

  // Determines the default "checked" value for incomplete stepAttempt (albeit, Focus -or- otherwise)
  const determineDefaultCheckedValue = (attempt: StepAttempt): void => {
    if (attempt && attempt.target_prompt_level) {
      const prevPromptLevelMap = ChainMastery.getPrevPromptLevel(attempt.target_prompt_level);
      setChecked(prevPromptLevelMap.order);
    }
  };

  // Store change in draft session
  const handleChange = (radioButtonIndex: number) => {
    setChecked(radioButtonIndex);
    const enumMap = Object.values(ChainStepPromptLevelMap)[radioButtonIndex];
    if (chainMasteryState.chainMastery && chainStepId !== undefined) {
      chainMasteryState.chainMastery.updateDraftSessionStep(
        chainStepId,
        'prompt_level',
        enumMap.key as ChainStepPromptLevel,
      );
    } else {
      throw new Error(`Cannot access chain mastery state.
        chainMasteryState.chainMastery loaded: ${!!chainMasteryState.chainMastery}
        chainStepId loaded: ${chainStepId !== undefined}
      `);
    }
  };

  return (
    <Animatable.View style={styles.container}>
      <View style={styles.promptSubContainer}>
        <Text style={styles.question}>{`What prompt did you use to complete the step?`}</Text>
        <View style={styles.promptOptsContainer}>
          {Object.values(ChainStepPromptLevelMap).map((e, i) => {
            if (e && e.key && e.key != ChainStepPromptLevel.none) {
              return (
                <View style={styles.checkboxContainer} key={randomId()}>
                  <View
                    style={{
                      height: 40,
                      width: 40,
                      padding: 0,
                      borderRadius: 100,
                      borderWidth: 2,
                      borderColor: CustomColors.uva.gray,
                    }}
                  >
                    <RadioButton
                      color={CustomColors.uva.orange}
                      value={e.key}
                      status={checked === i ? 'checked' : 'unchecked'}
                      onPress={() => handleChange(i)}
                    />
                  </View>
                  <Text style={styles.radioBtnText}>{e.value}</Text>
                </View>
              );
            }
          })}
        </View>
      </View>
    </Animatable.View>
  );
};

export default PromptAccordion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 10,
    paddingBottom: 10,
    marginTop: 5,
    marginBottom: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    width: '100%',
    backgroundColor: CustomColors.uva.white,
  },
  promptSubContainer: {
    paddingBottom: 10,
  },
  promptOptsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginLeft: 20,
  },
  checkboxContainer: {
    marginRight: 5,
    flexDirection: 'row',
    alignContent: 'center',
    margin: 5,
  },
  radioBtnText: {
    alignSelf: 'center',
    paddingLeft: 10,
    fontSize: 20,
  },
  question: {
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 20,
    fontWeight: '600',
  },
  input: {
    padding: 5,
  },
});
