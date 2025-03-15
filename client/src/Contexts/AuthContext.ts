import { createContext } from "react";
import { useAuthType } from "../types";

export const AuthContext = createContext<useAuthType | null>(null)