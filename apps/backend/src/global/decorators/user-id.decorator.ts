import { UserIdPipe } from '@global/pipes';
import { GetUser } from './user.decorator';

export const GetUserId = () => GetUser(UserIdPipe);
