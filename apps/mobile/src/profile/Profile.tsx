import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  View,
} from "react-native";
import { Label } from "../shared/components/label/Label";
import { ReactNode, useEffect, useState } from "react";
import { usePairs } from "../shared/hooks/pairs";
import { useUsers } from "../shared/hooks/users";
import { useFont } from "../shared/context/ThemeProvider";
import { useTheme } from "@react-navigation/native";
import { UserDto } from "@uaguape/common";
import GroupIcon from "../assets/icons/group.svg";

export const Profile = () => {
  const { getPairingCode } = usePairs();
  const users = useUsers();
  const [user, setUser] = useState<UserDto | null>(null);
  const font = useFont();
  const { colors } = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      const data = await users.get();
      setUser(data);
    };
    fetchUser();
  }, []);

  const generatePairingCode = async () => {
    const pairingUrl = await getPairingCode();
    await Share.share(
      {
        message: `Click on this link to join me! ${pairingUrl}`,
      },
      { dialogTitle: "Send this to someone so they can join you!" }
    );
  };

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: ReactNode;
  }) => {
    return (
      <View style={{ rowGap: 10 }}>
        <Label style={{ fontWeight: "bold", fontSize: font.size.large }}>
          {title}
        </Label>
        {children}
      </View>
    );
  };

  const Row = ({ children }: { children: ReactNode }) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {children}
      </View>
    );
  };

  return user ? (
    <ScrollView style={{ padding: 20 }} contentContainerStyle={{ rowGap: 25 }}>
      <Section title="My info">
        <Row>
          <Label>Name</Label>
          <Label>{user.name}</Label>
        </Row>
        <Row>
          <Label>Email</Label>
          <Label>{user.email}</Label>
        </Row>
      </Section>
      <View style={{ borderBottomWidth: 1 }}></View>
      <Section title="Pair">
        <Row>
          <Label>Name</Label>
          <Label>{user.pair?.name ?? "None"}</Label>
        </Row>
        <Row>
          <Pressable
            style={{
              width: "100%",
              flexDirection: "row",
              backgroundColor: colors.border,
              padding: 10,
              columnGap: 10,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
            }}
            onPress={generatePairingCode}
          >
            <Label style={{ fontSize: font.size.large, fontWeight: "500" }}>
              Generate code
            </Label>
            <GroupIcon width={25} height={25} fill={colors.text} />
          </Pressable>
        </Row>
      </Section>
    </ScrollView>
  ) : (
    <ActivityIndicator
      style={{ height: "100%" }}
      size={"large"}
      color={colors.text}
    />
  );
};
