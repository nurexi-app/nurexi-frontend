"use client";

import Loader from "@/components/web/Loader";
import { persistor, store } from "@/lib/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex items-center justify-center h-screen">
            <Loader />
          </div>
        }
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
