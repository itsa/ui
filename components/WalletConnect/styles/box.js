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
			'& > a:hover': {
				textDecoration: 'none',
			},
			[theme.breakpoints.up('sm')]: {
				flexDirection: 'row',
			},
        },
		buttonRow: {
			display: 'flex',
			flexDirection: 'row',
			gap: '1rem',
			// margin: theme.spacing(2, 0),
		},
		standardButtons: {
			'& button': {
				width: 120,
				[theme.breakpoints.down('sm')]: {
					width: 135,
				},
			},
			'& > a': {
				width: 120,
				[theme.breakpoints.down('sm')]: {
					width: 135,
				},
			},
        },
		wideButtons: {
			'& button': {
				width: 165,
				[theme.breakpoints.down('sm')]: {
					width: 280,
					paddingTop: 12,
					paddingBottom: 0,
				},
			},
			'& > a': {
				width: 165,
				[theme.breakpoints.down('sm')]: {
					width: 280,
					paddingTop: 12,
					paddingBottom: 0,
				},
			},
        },
		extrawideButtons: {
			[theme.breakpoints.down('sm')]: {
				gap: '1.5rem',
				padding: theme.spacing(2, 0),
			},
			'& button': {
				width: 190,
				[theme.breakpoints.down('sm')]: {
					width: 280,
				},
			},
			'& > a': {
				width: 190,
				[theme.breakpoints.down('sm')]: {
					width: 280,
				},
			},
        },
        ultrawideButtons: {
			[theme.breakpoints.down('sm')]: {
				gap: '1.5rem',
				margin: theme.spacing(8, 0, 3, 0),
			},
			'& button': {
				width: 290,
				[theme.breakpoints.down('sm')]: {
					width: 280,
				},
			},
			'& > a': {
				width: 290,
				[theme.breakpoints.down('sm')]: {
					width: 280,
				},
			},
        },
		errorText: {
			color: `${theme?.palette?.red[300] ?? 'red'}!important`,
		},
		hidden: {
			display: 'none',
		},
		bluetoothMarker: {
			position: 'absolute',
			zIndex: 1,
			right: 2,
			top: -3,
			fontSize: 10,
			fontWeight: 600,
			color: theme?.palette?.default?.contrastText,
			opacity: 0.7,
		},
		walletMainImage: {
			width: '8rem',
			height: '8rem',
			verticalAlign: 'middle',
            fill: theme?.palette?.primary?.dark,
			[theme.breakpoints.down('sm')]: {
				display: 'none',
			},
	},
        walletsContainerItem: {
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
		addressIconLedger: {
			height: '1rem',
            fill: theme?.palette?.default?.contrastText,
            marginLeft: '0.25rem',
			opacity: 0.7,
		},
		addressIconBrave: {
			height: '1.5rem',
			width: '1.5rem',
            marginLeft: '0.1rem',
			opacity: 0.75,
		},
		addressIconMetamask: {
			height: '1.5rem',
            marginLeft: '0.25rem',
			opacity: 0.85,
		},
		ledgerIcon: {
			width: '6rem',
            fill: theme?.palette?.default?.contrastText,
            padding: '0.5rem',
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
			[theme.breakpoints.down('sm')]: {
				fontSize: '1.3rem',
				paddingTop: 0,
				margin: 0,
			},
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
			'& span': {
				display: 'block',
				fontSize: '0.7rem',
				opacity: 0.7,
			},
		},
		noBrowserSupport: {
			position: 'absolute',
			bottom: 6,
			fontSize: '0.7rem',
		},
		addressDescription: {
			color: theme?.palette?.primary?.contrastText || '#000000',
			fontSize: '1rem!important',
			marginTop: '1.5rem',
			marginBottom: '0.25rem',
		},
		hardwareAddressDescription: {
			fontSize: '1rem!important',
			padding: '0 0.2rem',
		},
		noApp: {
			color: `${theme?.palette?.red[300] ?? 'red'}!important`,
		},
		iconButton: {
		},
		addressContainer: {
			color: theme?.palette?.primary?.contrastText || '#000000',
			marginTop: '1rem',
			display: 'flex',
			alignItems: 'center',
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
		buttonStyleBtnLabel: {
			width: '7.5rem',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
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
			marginBottom: 0,
			fontSize: '1rem',
			[theme.breakpoints.down('sm')]: {
				marginTop: '0.1rem',
			},
			'& a': {
				color: theme?.palette?.primary?.contrastText || '#212121',
				marginLeft: '0.5rem',
			},
			'& a:hover': {
				textDecoration: 'none',
				color: theme?.palette?.primary?.contrastText || '#000000',
			},
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
			'& > *': {
				margin: '0 0.5rem',
			}
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
		iconBoxInnerDisabled: {
			color: `${alpha(theme?.palette?.primary?.contrastText || '#212121', 0.3)}`,
			cursor: 'default',
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
		listItemAddress: {
			height: '3em',
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
		addressPicker: {
			width: '100%',
			maxWidth: 500,
		},
	};});