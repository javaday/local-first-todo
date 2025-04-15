import { Body, Button, Column, Container, Font, Head, Heading, Hr, Html, Img, Link, Preview, Row, Section, Tailwind, Text } from "@react-email/components";
import { MemberModel } from "~/data/models/member.model";

interface ListInvitationProps {
	to: string;
	from: MemberModel;
	listName: string;
	acceptLink: string;
}

export function ListInvitation(props: ListInvitationProps) {

	const { to, from, listName, acceptLink } = props;
	const appTitle = process.env.APP_TITLE;

	const baseUrl = process.env.VERCEL_URL
		? `https://${process.env.VERCEL_URL}`
		: `http://${process.env.APP_DOMAIN}`;

	const invitedByName = from.firstName ?
		`${from.firstName} ${from.lastName}`.trim() :
		from.email.split('@')[0];

	const invitedName = to.split('@')[0];

	const previewText = `Join the ${listName} on ${appTitle}`;

	return (
		<Html>
			<Head>
				<Font
					fontFamily="Inter"
					fallbackFontFamily="Helvetica"
					webFont={{
						url: 'https://fonts.googleapis.com/css2?family=Inter&display=swap',
						format: 'woff2',
					}}
					fontWeight={400}
					fontStyle="normal"
				/>
			</Head>
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="mx-auto my-auto bg-gray-100/70 pt-6 font-sans text-gray-900 antialiased">
					<Container className="mx-auto my-[40px] rounded bg-white">
						<Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
							Your <strong>{appTitle}</strong> List Invitation
						</Heading>
						<Text className="text-black text-[20px] leading-[24px]">
							Hello {invitedName},
						</Text>
						<Text className="text-black text-[20px] leading-[24px] mt-[20px]">
							<strong>{invitedByName}</strong> (
							<Link
								href={`mailto:${from.email}`}
								className="text-blue-600 no-underline"
							>
								{from.email}
							</Link>
							) is inviting you to join the <strong>{listName}</strong> on <strong>{appTitle}</strong>.
						</Text>
						<Section>
							<Row>
								<Text className="text-[26px] font-bold leading-9 tracking-tight text-gray-900">
									Here's a few features our community enjoys:
								</Text>
							</Row>
						</Section>
						<Section>
							<Row className="mb-[20px]">
								<Column align="center" className="w-[50%]">
									<Img
										src="https://utfs.io/f/SiWWz1xJUBrmbTrKB7MnUaZ9Te3Iu2XtB1oVM047FwqArH5L"
										className="h-full w-[75px]"
									/>
								</Column>
								<Column className="w-[50%] align-baseline">
									<Text className="text-[20px] text-gray-900">
										Be sure you have everything you need with{' '}
										<Link className="font-bold text-blue-600">
											Check Lists
										</Link>
										.
									</Text>
								</Column>
							</Row>
							<Row className="mb-[20px]">
								<Column align="center" className="w-[50%]">
									<Img
										src="https://utfs.io/f/SiWWz1xJUBrmiRqNNfCMcmY5A96btLWTng2ey4PRo8jkhNfa"
										className="h-full w-[75px]"
									/>
								</Column>
								<Column className="w-[50%] align-baseline">
									<Text className="text-[20px] text-gray-900">
										Always have your data at the ready with{' '}
										<Link className="font-bold text-blue-600">
											Offline Data Access
										</Link>
										.
									</Text>
								</Column>
							</Row>
						</Section>
						<Section className="text-center mt-[32px] mb-[32px]">
							<Button href={acceptLink} className="rounded bg-black px-6 py-3 text-lg text-white">
								Join {appTitle}
							</Button>
						</Section>
						<Text className="text-center text-black text-[14px] leading-[24px]">
							If the button does not work, you can copy and paste this URL into your browser:
						</Text>
						<Text className="text-center text-black text-[14px] leading-[24px]">
							<Link href={acceptLink} className="text-blue-600 no-underline">
								{acceptLink}
							</Link>
						</Text>
						<Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
						<Text className="text-[#666666] text-[12px] leading-[24px]">
							This invitation was intended for{" "}
							<span className="text-black">{invitedName}</span>. If you
							were not expecting this invitation, or are not {invitedName}, you can ignore this email.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html >
	);
}
