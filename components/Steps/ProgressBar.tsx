import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProgressBar as ProgBar } from 'react-native-paper';
import CustomColors from '../../styles/Colors';
import { ChainStep } from '../../types/CHAIN/ChainStep';

type Props = {
  masteryLevel: string;
  currentStepIndex: number;
  totalSteps: number;
  chainSteps: ChainStep[];
};

const ProgressBar: FC<Props> = props => {
  const { totalSteps, currentStepIndex, masteryLevel, chainSteps } = props;
  // console.log(steps);

  const [mastery, setMastery] = useState('focus');
  const [barColor, setBarColor] = useState(CustomColors.uva.magenta);

  // Convert progress to "0.1 - 1.0" value
  const progressBarCalculation = (len: number, currStep: number): number => {
    return currStep / len;
  };

  const getMasteryLevel = () => {
    if (mastery === 'mastered') {
      setBarColor(CustomColors.uva.cyan);
    } else if (mastery === 'focus') {
      setBarColor(CustomColors.uva.magenta);
    } else {
      setBarColor(CustomColors.uva.gray);
    }
  };

  useEffect(() => {}, [currentStepIndex]);

  useEffect(() => {
    setMastery(masteryLevel);
    getMasteryLevel();
  }, [masteryLevel]);

  return (
    <View style={styles.container}>
      <ProgBar
        style={styles.progressBar}
        progress={progressBarCalculation(totalSteps, currentStepIndex)}
        color={barColor}
      />
      <Text style={styles.progressText}>
        Step {currentStepIndex + 1} out of {chainSteps.length}
      </Text>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'flex-start',
  },
  progressBar: {
    justifyContent: 'center',
    width: 200,
    height: 40,
    borderWidth: 0,
    borderRadius: 5,
  },
  progressText: {
    fontSize: 16,
    paddingTop: 5,
    paddingLeft: 5,
  },
});
