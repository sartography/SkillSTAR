import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppHeader from '../components/Header/AppHeader';

const NoQuestionnaireScreen = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <AppHeader name={'No SkillSTAR data found for participant'} />
      <Text>{`Please visit STAR DRIVE to fill out the profile for the selected participant.`}</Text>
    </View>
  );
};

export default NoQuestionnaireScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
  },
});
