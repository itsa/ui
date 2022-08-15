import { makeStyles, alpha } from '@material-ui/core';

export default makeStyles(theme => {
	return {
		root: {
			position: 'relative',
			display: 'flex',
			flexDirection: 'column',
			textAlign: 'center',
			zIndex: 2,
		},
        walletsContainer: {
			display: 'flex',
			flexDirection: 'column',
			gap: '1rem',
			margin: theme.spacing(2, 0),
			[theme.breakpoints.up('sm')]: {
				flexDirection: 'row',
			},
        },
		walletMainImage: {
			width: '8rem',
			height: '8rem',
			verticalAlign: 'middle',
            fill: theme?.palette?.primary?.dark,
		},
        walletsContainerItem: {
			width: '100%',
			maxWidth: 140,
			padding: theme.spacing(2),
			borderRadius: 12,
			backgroundColor: theme.palette.default.light,
			border: `1px solid ${alpha(theme.palette.primary.light, 0.1)}`,
			'&:hover':{
				backgroundColor: theme.palette.default.light,
				borderColor: theme.palette.secondary.dark,
			},
            '& .MuiButton-label':{
				display: 'flex',
				flexDirection: 'column',
			}
        },
		walletIcon: {
			width: '4rem',
			height: '4rem',
			verticalAlign: 'middle',
		},
		walletIconConnected: {
			border: `solid 1px ${theme?.palette?.primary?.light}`,
		},
		ledgerIcon: {
			width: '6rem',
            fill: theme?.palette?.default?.contrastText,
            padding: '0.5rem'
		},
		networkIcon: {
			width: '4rem',
			height: '4rem',
			verticalAlign: 'middle',
		},
		networkIconConnected: {
			width: 64,
			minHeight: 64,
			verticalAlign: 'middle',
			marginBottom: '2rem',
		},
		title: {
			fontWeight: 'bold',
			fontSize: '1.5rem',
			paddingTop: '0.8rem',
		},
		titleMetaMask: {
			fontWeight: 'bold',
			fontSize: '1.3rem',
			textTransform: 'uppercase',
			verticalAlign: 'middle',
			marginLeft: '0.5rem',
			letterSpacing: '2px',
		},
		titleNetwork: {
			fontSize: '1rem',
			marginBottom: theme.spacing(1),
			color: theme?.palette?.primary?.contrastText || '#212121',
		},
		description: {
			color: theme?.palette?.primary?.contrastText || '#212121',
			fontSize: '1rem',
		},
		addressDescription: {
			color: theme?.palette?.primary?.contrastText || '#000000',
			fontSize: '0.9rem',
			marginTop: '1rem',
		},
		buttonStyleBtn: {
			// className that is set on the button (buttonStyle); can be overruled by user
			marginTop: '1rem',
			backgroundColor: theme?.palette?.primary?.light,
			color: '#000000',
			letterSpacing: '1.25px',
			padding: '6px 16px',
			'&:hover': {
				backgroundColor: theme?.palette?.secondary?.light,
			},
		},
		btn: {
			marginTop: '1rem',
			backgroundColor: theme?.palette?.primary?.light,
			color: '#000000',
			letterSpacing: '1.25px',
			padding: '6px 16px',
			'&:hover': {
				backgroundColor: theme?.palette?.secondary?.light,
				textDecoration: 'none',
			},
		},
		btnButtonStyle: {
			width: '100%',
			backgroundColor: theme?.palette?.primary?.light,
			color: '#000000',
			letterSpacing: '1.25px',
			padding: '6px 16px',
			'&:hover': {
				backgroundColor: theme?.palette?.secondary?.light,
			},
		},
		downloadDescription: {
			marginTop: '1.5rem',
			fontSize: '1rem',
		},
		copied: {
			padding: theme.spacing(1, 4),
			color: theme?.palette?.primary?.dark || '#000000',
			backgroundColor: theme?.palette?.background || '#FFFFFF',
		},
		iconBox: {
			display: 'flex',
			justifyContent: 'space-evenly',
			margin: '1.5rem 0 1rem',
			'& a': {
				color: theme?.palette?.primary?.contrastText || '#212121',
			},
			'& a:hover': {
				textDecoration: 'none',
				color: theme?.palette?.primary?.contrastText || '#000000',
			},
		},
		iconBoxInner: {
			display: 'flex',
			alignItems: 'center',
			cursor: 'pointer',
			'& > div': {
				marginTop: '0.2rem',
			},
			'& > span': {
				marginLeft: '0.4rem',
			},
		},
		select: {
			width: '100%',
		},
		selectPaper: {},
		selectRoot: {
			paddingTop: '0.6rem',
			paddingBottom: '0.6rem',
			color: theme?.palette?.primary?.contrastText,
		},
		listIcons: {
			width: '100%',
			maxWidth: 400,
			'& $listItem + $listItem':{
				marginTop: theme.spacing(1),
			},
		},
		listItem: {
			border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
			borderRadius: 6,
		},
		listItemActive: {
			backgroundColor: alpha(theme.palette.secondary.main, 0.85),
		},
		networkIcon: {
			overflow: 'inherit',
			'& .MuiAvatar-img':{
				marginTop: 2,
			},
		},
		networkIconImgUnknown: {
			fontSize: 14,
			fontWeight: 700,
			color: theme.palette.secondary.light,
		},
	};});
