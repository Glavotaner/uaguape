import { UserDto } from "uaguape-common";
import { useApi } from "../context/ApiProvider";
import { PairRoutes } from "uaguape-routes";

export const usePairs = () => {
  const { pairs } = useApi();

  return {
    get: (pairId: string) => pairs.get<UserDto, UserDto>(pairId),
    getPairingCode: () => pairs.get<string>(PairRoutes.GENERATE_PAIR_CODE),
    setPair: (pairId: string) => pairs.patch<UserDto, UserDto, UserDto>(pairId),
  };
};
