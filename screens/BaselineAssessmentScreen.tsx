import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { PROBE_INSTRUCTIONS } from '../constants/chainshome_text';
import AppHeader from '../components/Header/AppHeader';
import { Loading } from '../components/Loading/Loading';
import DataVerificationList from '../components/Probe/DataVerificationList';
import { useChainMasteryContext } from '../context/ChainMasteryProvider';
import { ApiService } from '../services/ApiService';
import CustomColors from '../styles/Colors';
import { ChainSessionTypeMap } from '../types/chain/ChainSession';
import { StepAttemptField, StepAttemptFieldName } from '../types/chain/StepAttempt';
import { DataVerificationControlCallback } from '../types/DataVerificationControlCallback';

const BaselineAssessmentScreen = (): JSX.Element => {
  /**
   * Set session type: Probe or Training
   */
  const navigation = useNavigation();
  const [chainMasteryState, chainMasteryDispatch] = useChainMasteryContext();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const updateChainData: DataVerificationControlCallback = async (
    chainStepId: number,
    fieldName: StepAttemptFieldName,
    fieldValue: StepAttemptField,
  ): Promise<void> => {
    if (
      chainMasteryState &&
      chainMasteryState.chainMastery &&
      chainMasteryState.chainMastery.chainData &&
      chainMasteryState.chainMastery.draftSession
    ) {
      chainMasteryState.chainMastery.updateDraftSessionStep(chainStepId, fieldName, fieldValue);

      if (fieldName === 'completed') {
        chainMasteryState.chainMastery.updateDraftSessionStep(chainStepId, 'was_prompted', !fieldValue);
      }
    }
  };

  const updateSession = async (): Promise<void> => {
    setIsSubmitted(true);
    if (
      chainMasteryState &&
      chainMasteryState.chainMastery &&
      chainMasteryState.chainMastery.chainData &&
      chainMasteryState.chainMastery.draftSession
    ) {
      chainMasteryState.chainMastery.draftSession.completed = true;
      chainMasteryState.chainMastery.saveDraftSession();
      const dbChainData = await ApiService.upsertChainData(chainMasteryState.chainMastery.chainData);
      if (dbChainData) {
        chainMasteryState.chainMastery.updateChainData(dbChainData);
        chainMasteryDispatch({ type: 'chainMastery', payload: chainMasteryState.chainMastery });
        navigation.navigate('ChainsHomeScreen', {});
      } else {
        console.error('Something went wrong with saving the chain data.');
      }
    }
  };

  return chainMasteryState &&
    chainMasteryState.chainMastery &&
    chainMasteryState.chainMastery.chainData &&
    chainMasteryState.chainMastery.draftSession &&
    !isSubmitted ? (
    <View style={styles.image}>
      <View style={styles.container}>
        <AppHeader name={'Brushing Teeth'} />
        <View style={styles.instructionContainer}>
          <Text style={styles.screenHeader}>
            {(ChainSessionTypeMap[chainMasteryState.chainMastery.draftSession.session_type as string].value ||
              'Baseline Assessment') + ' Session'}
          </Text>
          <Text style={styles.instruction}>{PROBE_INSTRUCTIONS}</Text>
        </View>
        <View style={styles.formContainer}>
          <DataVerificationList onChange={updateChainData} />
        </View>
        <View style={styles.nextBackBtnsContainer}>
          {!isSubmitted ? (
            <Button
              style={styles.nextButton}
              color={CustomColors.uva.orange}
              labelStyle={{
                fontSize: 24,
                fontWeight: '600',
                color: CustomColors.uva.white,
              }}
              mode={'contained'}
              onPress={() => {
                updateSession();
              }}
            >{`Submit`}</Button>
          ) : (
            <Button
              style={styles.nextButton}
              color={CustomColors.uva.gray}
              labelStyle={{
                fontSize: 24,
                fontWeight: '600',
                color: CustomColors.uva.white,
              }}
              mode={'contained'}
              onPress={() => {
                console.log('Submitted Probe data');
              }}
            >{`Thanks`}</Button>
          )}
        </View>
      </View>
    </View>
  ) : (
    <View style={styles.middle}>{!isSubmitted ? <Loading /> : <Text>{`Saving data...`}</Text>}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 0,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  instructionContainer: {
    marginLeft: 40,
    marginRight: 40,
    margin: 10,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  screenHeader: {
    marginLeft: 10,
    marginTop: 0,
    paddingBottom: 10,
    fontSize: 22,
    fontWeight: '600',
  },
  instruction: {
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 16,
  },
  formContainer: {
    height: '65%',
    paddingBottom: 10,
  },
  nextBackBtnsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 400,
  },
  nextButton: {
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    fontWeight: '600',
  },
  middle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BaselineAssessmentScreen;
