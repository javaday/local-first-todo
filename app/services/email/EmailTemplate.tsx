import type { JSX } from "react";
import {
	AppInvitation,
	TemplateName,
} from "./templates";


const emails: Record<TemplateName, (props: any) => JSX.Element> = {
	[TemplateName.AppInvitation]: AppInvitation,
}

export const useEmailTemplate = (template: TemplateName, data: any) => {

	const TheEmail = emails[template];

	return <TheEmail {...data} />
}