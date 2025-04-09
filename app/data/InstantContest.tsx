import { init, InstantReactWebDatabase } from "@instantdb/react";
import type { AppSchema } from 'instant.schema';
import { createContext, type ReactNode } from 'react';


const INSTANT_APP_ID = import.meta.env.VITE_INSTANT_APP_ID;


interface InstantContextValue {
	db: InstantReactWebDatabase<AppSchema>;
}

const db = init<AppSchema>({
	appId: INSTANT_APP_ID,
	devtool: {
		position: 'bottom-left',
	},
});

const InstantContext = createContext<InstantContextValue>({
	db,
});

const InstantContextProvider = ({ children }: { children: ReactNode }) => {

	return (
		<InstantContext.Provider value={{ db }}>
			{children}
		</InstantContext.Provider>
	);
};

export { InstantContext, InstantContextProvider };
