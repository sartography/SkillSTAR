import React, { useState, useEffect, ReactNode } from "react";
import {
	StyleSheet,
	Text,
	View,
	ImageBackground,
	Dimensions,
} from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { RootNavProps } from "../navigation/root_types";
import { Session } from "../types/CHAIN/Session";
import CustomColors from "../styles/Colors";
import AppHeader from "../components/Header/AppHeader";
import DataVerificationList from "../components/Probe/DataVerificationList";
import { DataVerificationListItem } from "../components/Probe/index";
import { StepAttempt } from "../types/CHAIN/StepAttempt";
import { chainSteps } from "../data/chainSteps";

type Props = {
	route: RootNavProps<"BaselineAssessmentScreen">;
	navigation: RootNavProps<"BaselineAssessmentScreen">;
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

/**
 *
 */
function BaselineAssessmentScreen({ route }: Props): ReactNode {
	/**
	 * Set session type: Probe or Training
	 */
	const navigation = useNavigation();
	let [stepIndex, setStepIndex] = useState(0);
	let [readyToSubmit, setReadyToSubmit] = useState(false);
	let [sessionReady, setSessionReady] = useState(false);
	let [session, setSession] = useState(new Session());
	let [text, setText] = useState("");

	/** CONTEXT API **
	 * set session data aftter createAttempts finished
	 */

	const createAttempts = () => {
		chainSteps.forEach((e, i) => {
			let { stepId, instruction } = chainSteps[i];
			session.addStepData(new StepAttempt(stepId, instruction));
		});
		setSessionReady(true);
	};

	/** START: Lifecycle calls */
	useEffect(() => {
		if (!session.data.length) {
			createAttempts();
		}
	}, []);
	/** END: Lifecycle calls */

	const setSessionData = () => {
		// Context API set session data
		// navigate to chainshomescreen
	};

	return (
		// <ImageBackground
		// 	source={require("../assets/images/sunrise-muted.png")}
		// 	resizeMode={"cover"}
		// 	style={styles.image}
		// >
		<View style={styles.image}>
			{sessionReady && (
				<View style={styles.container}>
					<AppHeader name="Brushing Teeth" />
					<View style={styles.instructionContainer}>
						{/* <Text style={styles.screenHeader}>Probe Session</Text> */}
						<Text style={styles.instruction}>
							Please instruct the child to brush their teeth. As
							they do, please complete this survey for each step.
						</Text>
					</View>
					<View style={styles.formContainer}>
						{<DataVerificationList session={session.data} />}
					</View>

					<View style={styles.nextBackBtnsContainer}>
						<Button
							style={styles.nextButton}
							color={CustomColors.uva.orange}
							labelStyle={{
								fontSize: 16,
								fontWeight: "600",
								color: CustomColors.uva.blue,
							}}
							mode="contained"
							onPress={() => {}}
						>
							NEXT
						</Button>
					</View>
				</View>
			)}
		</View>
		// </ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		paddingBottom: 0,
	},
	image: {
		flex: 1,
		resizeMode: "cover",
	},
	instructionContainer: {
		marginLeft: 40,
		marginRight: 40,
		margin: 10,
		flexDirection: "column",
		justifyContent: "space-around",
	},
	screenHeader: {
		marginLeft: 10,
		marginTop: 0,
		paddingBottom: 10,
		fontSize: 22,
		fontWeight: "600",
	},
	instruction: {
		paddingLeft: 10,
		paddingRight: 10,
		fontSize: 22,
	},
	formContainer: {
		height: "75%",
		paddingBottom: 10,
	},
	nextBackBtnsContainer: {
		marginTop: 10,
		flexDirection: "row",
		justifyContent: "center",
		marginBottom: 100,
	},
	nextButton: {
		width: "90%",
		height: 50,
		justifyContent: "center",
		alignSelf: "center",
		fontWeight: "600",
	},
});

export default BaselineAssessmentScreen;
