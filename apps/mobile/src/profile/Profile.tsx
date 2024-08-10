import { Pressable, ScrollView, Share, View } from "react-native";
import { Label } from "../shared/components/label/Label";
import { ReactNode, useEffect, useState } from "react";
import { usePairs } from "../shared/hooks/pairs";
import { useUsers } from "../shared/hooks/users";
import { useTheme } from "@react-navigation/native";
import { UserDto } from "@uaguape/common";
import GroupIcon from "@icons/group.svg";
import { Loading } from "../shared/components/Loading/Loading";
import { useStyle } from "./Profile.styles";

export const Profile = () => {
  const { getPairingCode } = usePairs();
  const users = useUsers();
  const [user, setUser] = useState<UserDto | null>(null);
  const styling = useStyle();
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
      <View style={styling.section}>
        <Label style={styling.sectionTitle}>{title}</Label>
        {children}
      </View>
    );
  };

  const Row = ({ children }: { children: ReactNode }) => {
    return <View style={styling.row}>{children}</View>;
  };

  const GeneratePairingCode = () => (
    <View style={styling.generatePairContainer}>
      <Pressable
        style={styling.generatePairButton}
        onPress={generatePairingCode}
      >
        <Label style={styling.generatePairText}>Generate code</Label>
        <GroupIcon {...styling.generatePairIcon} fill={colors.text} />
      </Pressable>
    </View>
  );

  return user ? (
    <ScrollView
      style={styling.scrollView}
      contentContainerStyle={styling.contentContainer}
    >
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
      <View style={styling.divider}></View>
      <Section title="Pair">
        <Row>
          <Label>Name</Label>
          <Label>{user.pair?.name ?? "None"}</Label>
        </Row>
        <Row>
          <GeneratePairingCode />
        </Row>
      </Section>
    </ScrollView>
  ) : (
    <Loading />
  );
};
