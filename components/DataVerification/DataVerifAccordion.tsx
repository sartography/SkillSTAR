import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { List } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import { PromptAccordion, BehavAccordion } from ".";
import CustomColors from "../../styles/Colors";

type Props = {
	stepAttempt: StepAttempt;
	switchVals: {};
};

const DataVerifAccordion: FC<Props> = (props) => {
	// { display: expanded ? "flex" : "none" }

	const { stepAttempt, switchVals } = props;

	const [expanded, setExpanded] = useState(true);
	const [promptData, setPromptData] = useState();
	const [behavData, setBehavData] = useState();

	const watchSwitchVals = () => {
		if (Object.values(switchVals).indexOf(true)) {
			// set
		}
	};

	useEffect(() => {
		watchSwitchVals();
	}, [switchVals]);

	return (
		<Animatable.View
			// style={[styles.container, { display: expanded ? "flex" : "none" }]}
			style={[styles.container]}
		>
			<PromptAccordion
				stepId={stepAttempt.stepId}
				switched={switchVals.promptSwitch}
			/>
			<BehavAccordion
				stepId={stepAttempt.stepId}
				switched={switchVals.behavSwitch}
			/>
		</Animatable.View>
	);
};

export default DataVerifAccordion;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		width: "100%",
		margin: 0,
		padding: 20,
		borderColor: CustomColors.uva.gray,
		borderWidth: 0,
		borderRadius: 10,
		backgroundColor: "rgba(255,255,255,0.3)",
	},
	promptSubContainer: {
		flexDirection: "row",
		paddingBottom: 10,
	},
	behavSubContainer: {
		flexDirection: "row",
		paddingBottom: 10,
	},
	behavOptsContainer: {
		flexDirection: "column",
		justifyContent: "space-around",
	},
	promptOptsContainer: {
		flexDirection: "column",
		justifyContent: "space-around",
	},

	question: {
		width: "50%",
		paddingTop: 5,
	},
	input: {
		padding: 5,
	},
});
