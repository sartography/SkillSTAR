import {useNavigation} from "@react-navigation/native";
import {Video} from "expo-av";
import React, {FC, useEffect, useState} from "react";
import {ImageBackground, StyleSheet, Text, View,} from "react-native";
import * as Animatable from "react-native-animatable";
import {Button} from "react-native-paper";
import AppHeader from "../components/Header/AppHeader";
import {MasteryIconContainer, ProgressBar, StarsNIconsContainer,} from "../components/Steps/index";
import {chainSteps} from "../data/chainSteps";
import {videos} from "../data/videos";
import {RootNavProps} from "../navigation/root_types";
import CustomColors from "../styles/Colors";
import {Session} from "../types/CHAIN/Session";
import {ChainStepStatus} from "../types/CHAIN/StepAttempt";

interface Props {
	route: RootNavProps<"StepScreen">;
	navigation: RootNavProps<"StepScreen">;
}

const StepScreen: FC<Props> = (props) => {
	const navigation = useNavigation();
	let [visible, setVisible] = React.useState(false);
	let [stepIndex, setStepIndex] = useState(0);
	let [session, setSession] = useState(new Session());
	let [video, setVideo] = useState(videos[`chain_0_${stepIndex + 1}`]);

	const incrIndex = () => {
		stepIndex += 1;
		setStepIndex(stepIndex);
	};

	const decIndex = () => {
		if (stepIndex > 0) {
			stepIndex -= 1;
			setStepIndex(stepIndex);
		}
	};

	const createAttempts = () => {
		console.log(chainSteps);

		chainSteps.forEach((e, i) => {
			let { stepId, instruction } = chainSteps[i];
			session.addStepData({chain_step_id: stepId, status: ChainStepStatus.not_complete, completed: false});
		});
	};

	const ReturnVideoComponent = () => {
		return (
			<Video
				source={videos[`step_${stepIndex + 1}`]}
				rate={1.0}
				volume={1.0}
				isMuted={true}
				resizeMode="cover"
				isLooping={false}
				useNativeControls={true}
				style={styles.video}
			/>
		);
	};

	/**
	 * BEGIN: LIFECYCLE CALLS
	 */
	useEffect(() => {
		if (!session.data.length) {
			createAttempts();
		}
	}, []);

	useEffect(() => {
		// Solves issue of videos not start play at beginning
		setVideo(videos[`chain_0_${stepIndex + 1}`]);
	}, [stepIndex]);
	/**
	 * END: LIFECYCLE CALLS
	 */

	return (
		<ImageBackground
			source={require("../assets/images/sunrise-muted.jpg")}
			resizeMode={"cover"}
			style={styles.image}
		>
			<View style={styles.container}>
				<AppHeader name={"Brush Teeth"} />
				<View style={styles.progress}>
					<Text style={styles.headline}>
						Step {chainSteps[stepIndex].stepId}:{" "}
						{chainSteps[stepIndex].instruction}
					</Text>

					<View style={styles.progressContainer}>
						<MasteryIconContainer masteryLevel={"focus"} />
						<ProgressBar
							currStep={stepIndex}
							totalSteps={session.data.length}
							masteryLevel={"focus"}
							steps={chainSteps}
						/>
					</View>
				</View>
				<StarsNIconsContainer />
				<View style={styles.subContainer}>
					<Animatable.View
						style={styles.subVideoContainer}
						duration={2000}
						animation={"fadeIn"}
					>
						{<ReturnVideoComponent />}
					</Animatable.View>
				</View>
				<View style={styles.bottomContainer}>
					{/* <Button
						style={styles.exitButton}
						color={CustomColors.uva.blue}
						mode="outlined"
						onPress={() => {
							console.log("exit");
							navigation.navigate("ChainsHomeScreen");
						}}
					>
						Exit
					</Button> */}
					<Button
						style={styles.neededPromptingBtn}
						color={CustomColors.uva.orange}
						mode="contained"
						onPress={() => {
							console.log("NEEDING PROMPTING");
						}}
					>
						Needed Additional Prompting
					</Button>
				</View>
				<View style={styles.nextBackBtnsContainer}>
					<Button
						style={styles.backButton}
						color={CustomColors.uva.blue}
						mode="outlined"
						onPress={() => {
							decIndex();
						}}
					>
						Previous Step
					</Button>
					<Button
						style={styles.nextButton}
						color={CustomColors.uva.blue}
						mode="contained"
						onPress={() => {
							if (stepIndex + 1 <= chainSteps.length - 1) {
								incrIndex();
							} else {
								navigation.navigate("DataVerificationScreen", {
									session,
								});
							}
						}}
					>
						Step Complete
					</Button>
				</View>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
	},
	image: {
		flex: 1,
		resizeMode: "cover",
	},
	progress: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 0,
		marginTop: 20,
	},
	progressContainer: {
		flexDirection: "row",
	},
	instructionContainer: {},
	headline: {
		width: "60%",
		// textAlign: "",
		fontSize: 22,
		fontWeight: "600",
		padding: 10,
	},
	subContainer: {
		flexDirection: "column",
	},
	challengingBehavior: {
		flexDirection: "row",
		padding: 10,
		paddingLeft: 80,
		alignContent: "center",
		justifyContent: "flex-start",
	},
	icon: {
		padding: 10,
	},
	itemName: {},
	subVideoContainer: {
		padding: 10,
		height: 400,
		flexDirection: "row",
		justifyContent: "center",
	},
	video: {
		height: 400,
		width: "100%",
	},
	progressBar: {
		width: 200,
		height: 40,
		borderWidth: 0,
		borderRadius: 5,
	},
	focusStepIcon: {
		height: 30,
	},
	bottomContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignContent: "center",
		paddingVertical: 15,
		margin: 15,
	},
	neededPromptingBtn: {},
	exitButton: {},
	nextBackBtnsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	nextButton: {
		width: 244,
		margin: 15,
	},
	backButton: {
		margin: 15,
	},
});

export default StepScreen;
