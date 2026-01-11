import type {IAccount} from "../account/IAccount.ts";

export interface IAuthState {
    user: IAccount | null;
}