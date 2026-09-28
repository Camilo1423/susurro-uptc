import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
  /** Estado de carga global (pantalla completa) para transiciones de contexto. */
  global: boolean;
}

const initialState: LoadingState = {
  global: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    /** Activa/desactiva el loader global de pantalla completa. */
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.global = action.payload;
    },
  },
});

export const { setGlobalLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
