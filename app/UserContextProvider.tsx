'use client'

import {useState} from "react";
import { UserContext} from "../hooks/userContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState();
    return <UserContext.Provider value={[user, setUser]}>{children}</UserContext.Provider>
}

export default Providers
