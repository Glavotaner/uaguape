import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthorizedStackParamList } from "./authorized-stack-param.list";

type Screen<T extends keyof AuthorizedStackParamList> = NativeStackScreenProps<
  AuthorizedStackParamList,
  T
>;

export type QuestionProps = Screen<"Question">;
export type HomeProps = Screen<"Home">;
export type PairingRequestProps = Screen<"PairingRequest">;
export type PairingProps = Screen<"Pairing">;
