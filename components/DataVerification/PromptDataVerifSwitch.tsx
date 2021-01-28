import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Switch } from 'react-native-paper';
import CustomColors from '../../styles/Colors';
import { StepAttemptFieldName } from '../../types/chain/StepAttempt';
import { DataVerificationControlCallback } from '../../types/DataVerificationControlCallback';

interface PromptDataVerifSwitchProps {
  fieldName: StepAttemptFieldName;
  chainStepId: number;
  handleSwitch: DataVerificationControlCallback;
}

const PromptDataVerifSwitch = (props: PromptDataVerifSwitchProps): JSX.Element => {
  const { fieldName, chainStepId, handleSwitch } = props;
  const [active, setActive] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const [label, setLabel] = useState('No');

  const handleSwitchVal = (fieldValue: boolean) => {
    return handleSwitch(chainStepId, fieldName, fieldValue);
  };

  // Toogle switch label (yes/no)
  const toggleLabel = () => {
    setLabel(isSwitchOn === false ? 'No' : 'Yes');
    // checkTypeAgainstSwitchVal();
  };

  // callback for setting isSwitchOn value
  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    handleSwitchVal(isSwitchOn);
  };
  //

  /** START: Lifecycle calls */
  useEffect(() => {
    toggleLabel();
    setActive(!active);
  }, [isSwitchOn]);
  /** END: Lifecycle calls */

  return (
    <Animatable.View style={styles.container}>
      <View style={styles.subContainer}>
        <Text style={styles.label}>{label}</Text>
        <Switch
          value={isSwitchOn}
          color={CustomColors.uva.orange}
          onValueChange={() => {
            onToggleSwitch();
          }}
          style={[styles.switch]}
        />
      </View>
    </Animatable.View>
  );
};

export default PromptDataVerifSwitch;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  subContainer: {
    flexDirection: 'row',
  },
  accordionContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    margin: 20,
    marginBottom: 40,
    padding: 20,
    borderColor: CustomColors.uva.gray,
    borderWidth: 0,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  accordionSubContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  question: {
    width: '50%',
    paddingTop: 5,
  },
  label: {
    fontSize: 28,
    textAlign: 'center',
    alignSelf: 'center',
  },
  switch: {
    margin: 20,
    alignSelf: 'center',
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
});
