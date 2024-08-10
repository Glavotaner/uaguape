import React from "react";
import { View } from "react-native";
import { HomeProps } from "../shared/types/screen-props";
import { useDailyQuestion } from "./hooks/daily-question.hook";
import { DailyQuestion } from "./components/DailyQuestion/DailyQuestion";
import { Loading } from "../shared/components/Loading/Loading";
import { useStyle } from "./Home.styles";

export const Home = ({ navigation, ...props }: HomeProps) => {
  const { dailyQuestion, openQuestion } = useDailyQuestion({
    navigation,
    ...props,
  });
  const styles = useStyle();

  return (
    <View style={styles.container}>
      {dailyQuestion ? (
        <DailyQuestion {...dailyQuestion} onPress={openQuestion} />
      ) : (
        <Loading />
      )}
    </View>
  );
};
