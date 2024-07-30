import { PickType } from "@nestjs/mapped-types";
import { UserDto } from "..";

export class TokenizedUserDto extends PickType(UserDto, ["email", "name"]) {}
