import { configureStore } from "@reduxjs/toolkit";
import { LoadingReducer, ModalReducer, SessionReducer } from "./slice";

export const store = configureStore({
  reducer: {
    modal: ModalReducer,
    session: SessionReducer,
    loading: LoadingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
