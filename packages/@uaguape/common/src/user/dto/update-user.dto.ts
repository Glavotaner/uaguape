import { OmitType, PartialType } from "@nestjs/mapped-types";
import { UserDto } from "..";

export class UpdateUserDto extends PartialType(
  OmitType(UserDto, ["email", "id", "pair"] as const)
) {}
