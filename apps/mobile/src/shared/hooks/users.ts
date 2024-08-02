import { UpdateUserDto, UserDto } from "@uaguape/common";
import { useApi } from "../context/ApiProvider";

export const useUsers = () => {
  const { users } = useApi();

  return {
    get: () => users.get<UserDto, UserDto>(""),
    update: (data: UpdateUserDto) =>
      users.patch<UserDto, UserDto, UpdateUserDto>("", data),
  };
};
