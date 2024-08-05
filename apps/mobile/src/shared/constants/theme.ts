import { Theme } from "@react-navigation/native";

export const LightTheme: Theme = {
  dark: false,
  colors: {
    primary: "#029784",
    background: "#00C9A7",
    card: "#029784",
    text: "#00291C",
    border: "#FFA17A",
    notification: "#00C9A7",
  },
};

export const DarkTheme: Theme = {
  ...LightTheme,
  dark: true,
};
