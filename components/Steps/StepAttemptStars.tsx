import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import CustomColors from "../../styles/Colors";

type Props = {
	promptType: string;
	attemptsWPromptType: number;
};

const StepAttemptStars: FC<Props> = (props) => {
	return (
		<View style={styles.container}>
			<View style={styles.subContainer}></View>
			<View style={styles.starContainer}>
				<Text style={styles.promptTypeText}>{props.promptType}</Text>
				<AntDesign
					name="star"
					size={50}
					color={CustomColors.uva.magenta}
					style={styles.star}
				/>
				<AntDesign
					name="staro"
					size={50}
					color={CustomColors.uva.magenta}
					style={styles.star}
				/>
				<AntDesign
					name="staro"
					size={50}
					color={CustomColors.uva.magenta}
					style={styles.star}
				/>
			</View>
		</View>
	);
};

export default StepAttemptStars;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		width: "33%",
	},
	subContainer: {},
	promptTypeText: {
		textAlign: "center",
		alignSelf: "center",
		paddingRight: 20,
		fontSize: 20,
		fontWeight: "600",
	},
	starContainer: {
		flexDirection: "row",
	},
	star: {},
});
