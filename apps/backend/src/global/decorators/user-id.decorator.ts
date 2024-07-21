import { UserIdPipe } from '../pipes/user-id.pipe';
import { GetUser } from './user.decorator';

export const GetUserId = () => GetUser(UserIdPipe);
