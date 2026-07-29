"use client";

/**
 * Carries the resolved guest down the client tree.
 *
 * The server component resolves `/undangan/<slug>` once; Gate, Rsvp, and the
 * variant switches read it from here instead of re-parsing the URL. Context
 * rather than props because the consumers sit several levels deep and the
 * value never changes for the life of the page.
 */
import { createContext, useContext, type ReactNode } from "react";
import { PUBLIC_GUEST, type InvitationGuest } from "@/lib/invitation";

const GuestContext = createContext<InvitationGuest>(PUBLIC_GUEST);

export const GuestProvider = ({
  guest,
  children,
}: {
  guest: InvitationGuest;
  children: ReactNode;
}) => <GuestContext.Provider value={guest}>{children}</GuestContext.Provider>;

export const useGuest = (): InvitationGuest => useContext(GuestContext);
