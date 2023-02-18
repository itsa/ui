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
		noOverflowX: {
			overflowX: 'hidden',
		},
        walletsContainer: {
			display: 'flex',
			flexDirection: 'row',
			gap: '1rem',
			margin: theme.spacing(2, 0),
			'& > a:hover': {
				textDecoration: 'none',
			},
			[theme.breakpoints.down('sm')]: {
				flexDirection: 'column',
			},
        },
		ledgerIconContainer: {
			position: 'relative',
		},
		buttonRow: {
			display: 'flex',
			flexDirection: 'row',
			gap: '1rem',
		},
		standardButtons: {
			'& button': {
				width: 120,
				[theme.breakpoints.down('sm')]: {
					width: 135,
				},
			},
			'& a': {
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
			'& a': {
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
			'& a': {
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
			'& a': {
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
			right: 6,
			top: -2,
			fontSize: 9,
			fontWeight: 600,
			color: theme?.palette?.default?.contrastText,
			opacity: 0.7,
			[theme.breakpoints.down('sm')]: {
				top: 9,
				right: 2,
				fontSize: 8,
			},
        },
		bluetoothMarkerBig: {
			position: 'absolute',
			zIndex: 1,
			right: 6,
			top: 11,
			fontSize: 11,
			fontWeight: 600,
			color: theme?.palette?.text?.primary || '#212121',
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
            '& .MuiButton-label':{
				display: 'flex',
				flexDirection: 'column',
			},
			'&[disabled]': {
				opacity: 0.5,
			},
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
            [theme.breakpoints.down('sm')]: {
                marginLeft: '-0.8rem',
                marginRight: '-0.1rem',
            },
		},
		addressIconBrave: {
			height: '1.5rem',
			width: '1.5rem',
            marginLeft: '0.1rem',
			opacity: 0.75,
            [theme.breakpoints.down('sm')]: {
                marginLeft: '-1.1rem',
                marginRight: '-0.6rem',
            },
		},
		addressIconMetamask: {
			height: '1.5rem',
            marginLeft: '0.25rem',
			opacity: 0.85,
            [theme.breakpoints.down('sm')]: {
                marginLeft: '-1rem',
                marginRight: '-0.2rem',
            },
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
		ledgerIconConnected: {
			width: 140,
			minHeight: 64,
			verticalAlign: 'middle',
			marginBottom: '2rem',
            fill: theme?.palette?.default?.contrastText,
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
			color: theme?.palette?.text?.primary || '#212121',
		},
		description: {
			color: theme?.palette?.text?.primary || '#212121',
			fontSize: '1rem',
			'& span': {
				display: 'block',
				fontSize: '0.7rem',
				opacity: 0.8,
			},
		},
		noBrowserSupport: {
			position: 'absolute',
			bottom: 6,
			fontSize: '0.7rem',
			color: theme?.palette?.text?.primary || '#212121',
			opacity: 0.8,
		},
		addressDescription: {
			color: theme?.palette?.text?.primary || '#000000',
			fontSize: '1rem!important',
			marginTop: '1.5rem',
			marginBottom: '0.25rem',
			[theme.breakpoints.down('sm')]: {
				fontSize: '0.8rem!important',
			},
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
			color: theme?.palette?.text?.primary || '#000000',
			marginTop: '1rem',
			display: 'flex',
			alignItems: 'center',
		},
		buttonStyleBtn: {
			// className that is set on the button (buttonStyle); can be overruled by user
			marginTop: '1rem',
			color: '#000000',
			letterSpacing: '1.25px',
			padding: '6px 16px',
		},
		buttonStyleBtnLabel: {
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
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
		},
		downloadDescription: {
			marginTop: '1.5rem',
			marginBottom: 0,
			fontSize: '1rem',
			[theme.breakpoints.down('sm')]: {
				marginTop: '0.1rem',
			},
			'& a': {
				color: theme?.palette?.text?.primary || '#212121',
				marginLeft: '0.5rem',
			},
			'& a:hover': {
				textDecoration: 'none',
				color: theme?.palette?.text?.primary || '#000000',
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
				color: theme?.palette?.text?.primary || '#212121',
			},
			'& a:hover': {
				textDecoration: 'none',
				color: theme?.palette?.text?.primary || '#000000',
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
			color: `${alpha(theme?.palette?.text?.primary || '#212121', 0.3)}`,
			cursor: 'default',
		},
		select: {
			width: '100%',
		},
		selectPaper: {},
		selectRoot: {
			paddingTop: '0.6rem',
			paddingBottom: '0.6rem',
			color: theme?.palette?.text?.primary,
		},
		listIcons: {
			width: '100%',
			maxWidth: 400,
			'& $listItem + $listItem':{
				marginTop: theme.spacing(1),
			},
		},
		listItem: {
		    border: `1px solid ${theme.palette.border.light}`,
			borderRadius: 6,
		},
		listItemAddress: {
			height: '3em',
		},
		listItemActive: {
			backgroundColor: theme.palette.background.main,
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
