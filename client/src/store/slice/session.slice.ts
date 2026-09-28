import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@Types";

interface SessionState {
  /** Usuario autenticado, o `null` si no hay sesión en memoria. */
  user: AuthUser | null;
}

const initialState: SessionState = {
  user: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    /** Guarda el usuario autenticado (tras sign-in). */
    setSession(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
    /** Actualiza parcialmente el usuario en sesión (no-op si no hay sesión). */
    updateSession(state, action: PayloadAction<Partial<AuthUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    /** Limpia la sesión (logout, expiración o cancelación). */
    clearSession(state) {
      state.user = null;
    },
  },
});

export const { setSession, updateSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
