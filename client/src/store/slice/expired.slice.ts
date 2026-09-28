import { createSlice } from "@reduxjs/toolkit";

/** Modal de "sesión expirada" (lo abre el interceptor de axios al fallar el refresh). */
export const modalSlice = createSlice({
  name: "expired",
  initialState: {
    isOpen: false,
  },
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
