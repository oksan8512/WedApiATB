import type {IAccount} from "../types/account/IAccount.ts";
import {jwtDecode} from "jwt-decode";

export function checkLogin(): boolean {
    const token = localStorage.getItem("token");
    return !!token;
}

export function logout(): void {
    localStorage.removeItem("token");
}

export function getUserInfo(): IAccount | null {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const user = jwtDecode<IAccount>(token);
    let roles: string[] = [];

    // const rawRoles = decodedToken["roles"];
    if(typeof user.roles === "string") {
        roles = [user.roles];
    }
    else if(Array.isArray(user.roles)) {
        roles = user.roles;
    }
    user.roles = roles;
    return user;
}