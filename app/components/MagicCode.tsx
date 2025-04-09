import { Box, Divider, Group, rem, Stepper, Text } from "@mantine/core";
import { IconMailOpened, IconUserCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useMember } from "~/data/hooks/useMember";
import { useOnlineStatus } from "~/hooks/useOnlineStatus";
import { VerifyCode } from "./VerifyCode";
import { VerifyEmail } from "./VerifyEmail";


export function MagicCode() {

	const { member, sendCode } = useMember();
	const online = useOnlineStatus();
	const navigate = useNavigate();

	const [step, setStep] = useState(0);
	const [stepLoading, setStepLoading] = useState(-1);
	const [verifiedEmail, setVerifiedEmail] = useState('');

	useEffect(() => {
		if (member) {
			navigate('/lists');
		}
	}, [member]);

	function onEmailVerified(email: string, verified: boolean) {

		setStepLoading(-1);

		if (verified) {
			setStepLoading(-1);
			setVerifiedEmail(email);
			sendCode(email);
			setStep(1);
		}
		else {

		}
	};

	function onCodeVerified(code: string, verified: boolean, error?: Error) {

		setStepLoading(-1);

		if (verified) {
			setStep(2);
		}
		else {

		}
	};

	if (online) {
		return (
			<Box mx="auto" mt={20}>
				<Stepper active={step}>
					<Stepper.Step
						icon={<IconUserCheck style={{ width: rem(18), height: rem(18) }} />}
						label="Email Address"
						description="Verify your email."
						loading={stepLoading === 0}>
						<Divider mb={10} />
						<VerifyEmail shouldExist={true} onLoading={() => setStepLoading(0)} onVerified={onEmailVerified} />
					</Stepper.Step>
					<Stepper.Step
						icon={<IconMailOpened style={{ width: rem(18), height: rem(18) }} />}
						label="Magic Code"
						description="Verify your code."
						loading={stepLoading === 1}>
						<Divider mb={10} />
						<VerifyCode email={verifiedEmail} onLoading={() => setStepLoading(1)} onVerified={onCodeVerified} />
					</Stepper.Step>
				</Stepper>
			</Box>
		);
	}
	else {
		return (
			<Box mx="auto">
				<Group justify="center">
					<Text fw={700} c="red">You must be online to log in.</Text>
				</Group>
			</Box>
		);
	}
}