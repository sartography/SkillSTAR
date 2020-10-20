import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

export type ChainStackParamList = {
    ChainHomeScreen: undefined;
    BaseAssessScreen: undefined;
    PrepMaterialsScreen: undefined;
    RewardScreen: undefined;
    StepScreen: undefined;
    TipsTricksScreen: undefined;
}

export type ChainNavProps<T extends keyof ChainStackParamList> = {
	navigation: StackNavigationProp<ChainStackParamList, T>;
	route: RouteProp<ChainStackParamList, T>;
};