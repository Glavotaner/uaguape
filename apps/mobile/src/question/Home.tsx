import React from "react";
import { View, ActivityIndicator } from "react-native";
import { HomeProps } from "../shared/types/screen-props";
import { useDailyQuestion } from "./hooks/daily-question.hook";
import { DailyQuestion } from "./components/DailyQuestion/DailyQuestion";

export const Home = ({ navigation, ...props }: HomeProps) => {
  const { dailyQuestion, openQuestion } = useDailyQuestion({
    navigation,
    ...props,
  });

  return (
    <View
      style={{
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      {dailyQuestion ? (
        <DailyQuestion {...dailyQuestion} onPress={openQuestion} />
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
};
