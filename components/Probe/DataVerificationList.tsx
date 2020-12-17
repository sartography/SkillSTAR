import React, { FC, useState, useEffect } from "react";
import shortid from "shortid";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { StepAttempt } from "../../types/CHAIN/StepAttempt";
import { DataVerificationListItem } from "./DataVerificationListItem";

type Props = {
	session: StepAttempt[];
};

const DataVerificationList: FC<Props> = (props) => {
	let { session } = props;

	return (
		<View style={styles.container}>
			<FlatList
				data={session}
				renderItem={({ item }) => (
					<DataVerificationListItem stepAttempt={item} />
				)}
				keyExtractor={() => shortid()}
			/>
		</View>
	);
};

export default DataVerificationList;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "flex-start",
		// paddingBottom: 20,
	},
});
