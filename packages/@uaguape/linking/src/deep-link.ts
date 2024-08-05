import { DeepLink } from "./enum/deep-link.enum";
import { DEEP_LINK_SCHEMA } from "./schema";

export const deepLink = {
  Question: {
    path: DeepLink.QUESTION,
    parse: { id: String },
    link: (id: string) =>
      `${DEEP_LINK_SCHEMA}${DeepLink.QUESTION.replace(":id", id)}`,
  },
  PairingRequest: {
    path: DeepLink.PAIRING,
    parse: { pairId: String },
    link: (pairId: string) =>
      `${DEEP_LINK_SCHEMA}${DeepLink.PAIRING.replace(":pairId", pairId)}`,
  },
};
