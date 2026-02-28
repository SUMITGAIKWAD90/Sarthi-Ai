import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserData, INITIAL_USERS } from "@/lib/dummyData";

interface UserContextType {
  users: UserData[];
  selectedUser: UserData | null;
  selectUser: (user: UserData) => void;
  addUser: (user: UserData) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserData[]>(INITIAL_USERS);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(INITIAL_USERS[0]);

  const addUser = (user: UserData) => {
    setUsers((prev) => [...prev, user]);
  };

  const selectUser = (user: UserData) => {
    setSelectedUser(user);
  };

  return (
    <UserContext.Provider value={{ users, selectedUser, selectUser, addUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
