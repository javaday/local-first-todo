import { useMediaQuery } from '@mantine/hooks';


export const useScreenInfo = () => {

	const isSmall = useMediaQuery('(max-width: 600px)', false) || false;
	const isMedium = useMediaQuery('(min-width: 768px) and (max-width: 991px)', false) || false;
	const isLarge = useMediaQuery('(min-width: 992px)', true) || true;
	const isPortrait = !useMediaQuery('(orientation: landscape)', false) || false;


	return { isSmall, isMedium, isLarge, isPortrait };
};
