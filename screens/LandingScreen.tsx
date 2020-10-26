import * as React from "react";
import { StyleSheet, Button } from "react-native";
import { RootNavProps as Props } from "../navigation/root_types";

import { Text, View } from "../components/Themed";

export default function LandingScreen({ navigation }: Props<"LandingScreen">) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>LANDING</Text>
			<Button
				title="To Skills Home"
				onPress={() => navigation.navigate("SkillsHomeScreen")}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
});