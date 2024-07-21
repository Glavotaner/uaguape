import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./root-stack-param-list";

type Screen<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type QuestionProps = Screen<"Question">;
export type HomeProps = Screen<"Home">;
export type PairingRequestProps = Screen<"PairingRequest">;
export type PairingProps = Screen<"Pairing">;
