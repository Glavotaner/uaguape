import React, { useEffect, useCallback } from "react";
import { View, ActivityIndicator } from "react-native";
import { HomeProps } from "../shared/types/screen-props";
import { useDailyQuestion } from "./hooks/daily-question.hook";
import { ProfileImage } from "./components/ProfileImage/ProfileImage";
import { DailyQuestion } from "./components/DailyQuestion/DailyQuestion";

export const Home = ({ navigation, ...props }: HomeProps) => {
  const { dailyQuestion } = useDailyQuestion({ navigation, ...props });

  const Profile = useCallback(
    () => <ProfileImage onPress={() => navigation.navigate("Pairing")} />,
    []
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: Profile,
    });
  }, []);

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
        <DailyQuestion
          {...dailyQuestion}
          onPress={() => {
            navigation.navigate("Question", {
              id: dailyQuestion.id,
            });
          }}
        />
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
};
