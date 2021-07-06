// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { isMobile, useMetamask, copyToClipboard } from '@itsa.io/web3utils';
import { Button, Link, Box, Select, MenuItem, Popover, Backdrop, makeStyles } from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import clsx from 'clsx';
import { toPairs } from 'lodash';
import {
	FileCopyOutlined as FileCopyOutlinedIcon,
	LaunchOutlined as LaunchOutlinedIcon,
} from '@material-ui/icons';

const NOOP = () => {};

const MATERIAL_UI_CSS_PROPS = {
	root: true,
	label: true,
	text: true,
	textPrimary: true,
	textSecondary: true,
	outlined: true,
	outlinedPrimary: true,
	outlinedSecondary: true,
	contained: true,
	containedPrimary: true,
	containedSecondary: true,
	disableElevation: true,
	focusVisible: true,
	disabled: true,
	colorInherit: true,
	textSizeSmall: true,
	textSizeLarge: true,
	outlinedSizeSmall: true,
	outlinedSizeLarge: true,
	containedSizeSmall: true,
	containedSizeLarge: true,
	sizeSmall: true,
	sizeLarge: true,
	fullWidth: true,
	startIcon: true,
	endIcon: true,
	iconSizeSmall: true,
	iconSizeMedium: true,
	iconSizeLarge: true,
};

const MetamaskLogo = props => (
	<svg
		className={props.className}
		viewBox="0 0 65 64"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M55.5608 7.13135L35.5734 21.9763L39.2695 13.218L55.5608 7.13135Z"
			fill="#E2761B"
			stroke="#E2761B"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M9.41931 7.13135L29.2461 22.1169L25.7307 13.218L9.41931 7.13135Z"
			fill="#E4761B"
			stroke="#E4761B"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M48.3697 41.5416L43.0464 49.6973L54.4363 52.831L57.7106 41.7224L48.3697 41.5416Z"
			fill="#E4761B"
			stroke="#E4761B"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M7.31 41.7224L10.5642 52.831L21.9541 49.6973L16.6308 41.5416L7.31 41.7224Z"
			fill="#E4761B"
			stroke="#E4761B"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M21.3115 27.7613L18.1376 32.5623L29.4471 33.0645L29.0453 20.9113L21.3115 27.7613Z"
			fill="#E4761B"
			stroke="#E4761B"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M43.6691 27.7619L35.8349 20.7713L35.5737 33.0651L46.8631 32.5629L43.6691 27.7619Z"
			fill="#E4761B"
			stroke="#E4761B"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M21.9545 49.6972L28.7442 46.3827L22.8785 41.8027L21.9545 49.6972Z"
			fill="#E4761B"
			stroke="#E4761B"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M36.2366 46.3827L43.0463 49.6972L42.1022 41.8027L36.2366 46.3827Z"
			fill="#E4761B"
			stroke="#E4761B"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M43.0456 49.6978L36.2358 46.3833L36.7782 50.8227L36.718 52.6909L43.0456 49.6978Z"
			fill="#D7C1B3"
			stroke="#D7C1B3"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M21.9537 49.6978L28.2814 52.6909L28.2412 50.8227L28.7434 46.3833L21.9537 49.6978Z"
			fill="#D7C1B3"
			stroke="#D7C1B3"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M28.3816 38.8697L22.7169 37.2024L26.7143 35.3745L28.3816 38.8697Z"
			fill="#233447"
			stroke="#233447"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M36.5981 38.8697L38.2654 35.3745L42.283 37.2024L36.5981 38.8697Z"
			fill="#233447"
			stroke="#233447"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M21.9537 49.6974L22.9179 41.5417L16.6304 41.7225L21.9537 49.6974Z"
			fill="#CD6116"
			stroke="#CD6116"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M42.0817 41.5417L43.0459 49.6974L48.3692 41.7225L42.0817 41.5417Z"
			fill="#CD6116"
			stroke="#CD6116"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M46.8625 32.5624L35.5732 33.0646L36.6177 38.87L38.285 35.3747L42.3026 37.2027L46.8625 32.5624Z"
			fill="#CD6116"
			stroke="#CD6116"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M22.7169 37.2027L26.7345 35.3747L28.3817 38.87L29.4463 33.0646L18.1368 32.5624L22.7169 37.2027Z"
			fill="#CD6116"
			stroke="#CD6116"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M18.1372 32.5624L22.8779 41.8028L22.7172 37.2027L18.1372 32.5624Z"
			fill="#E4751F"
			stroke="#E4751F"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M42.3029 37.2027L42.102 41.8028L46.8628 32.5624L42.3029 37.2027Z"
			fill="#E4751F"
			stroke="#E4751F"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M29.4466 33.0645L28.382 38.8698L29.7078 45.7198L30.0091 36.7004L29.4466 33.0645Z"
			fill="#E4751F"
			stroke="#E4751F"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M35.5733 33.0645L35.0309 36.6803L35.272 45.7198L36.6179 38.8698L35.5733 33.0645Z"
			fill="#E4751F"
			stroke="#E4751F"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M36.6179 38.8703L35.272 45.7203L36.2362 46.3832L42.1019 41.8032L42.3028 37.203L36.6179 38.8703Z"
			fill="#F6851B"
			stroke="#F6851B"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M22.7169 37.203L22.8776 41.8032L28.7433 46.3832L29.7075 45.7203L28.3817 38.8703L22.7169 37.203Z"
			fill="#F6851B"
			stroke="#F6851B"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M36.7183 52.6909L36.7786 50.8227L36.2764 50.3808H28.7033L28.2412 50.8227L28.2814 52.6909L21.9537 49.6978L24.1634 51.5057L28.643 54.6193H36.3366L40.8363 51.5057L43.046 49.6978L36.7183 52.6909Z"
			fill="#C0AD9E"
			stroke="#C0AD9E"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M36.236 46.3828L35.2718 45.7199H29.7075L28.7433 46.3828L28.2411 50.8222L28.7031 50.3803H36.2762L36.7784 50.8222L36.236 46.3828Z"
			fill="#161616"
			stroke="#161616"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M56.4043 22.9405L58.1118 14.7447L55.5606 7.13135L36.2361 21.4741L43.6686 27.7616L54.1746 30.835L56.5048 28.1232L55.5004 27.4L57.1074 25.9336L55.8619 24.9694L57.469 23.744L56.4043 22.9405Z"
			fill="#763D16"
			stroke="#763D16"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M6.88788 14.7447L8.59535 22.9405L7.5106 23.744L9.11763 24.9694L7.89227 25.9336L9.4993 27.4L8.49491 28.1232L10.805 30.835L21.311 27.7616L28.7435 21.4741L9.41895 7.13135L6.88788 14.7447Z"
			fill="#763D16"
			stroke="#763D16"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M54.1744 30.8351L43.6685 27.7617L46.8624 32.5627L42.1016 41.8031L48.369 41.7227H57.7099L54.1744 30.8351Z"
			fill="#F6851B"
			stroke="#F6851B"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M21.3113 27.7617L10.8053 30.8351L7.31 41.7227H16.6308L22.8781 41.8031L18.1374 32.5627L21.3113 27.7617Z"
			fill="#F6851B"
			stroke="#F6851B"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M35.573 33.0645L36.2359 21.4738L39.2893 13.2176H25.73L28.7432 21.4738L29.4462 33.0645L29.6873 36.7205L29.7074 45.7198H35.2717L35.3119 36.7205L35.573 33.0645Z"
			fill="#F6851B"
			stroke="#F6851B"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const safeClasses = classes => {
	const newClasses = {};
	toPairs(classes).forEach(item => {
		const key = item[0];
		const value = item[1];
		if (MATERIAL_UI_CSS_PROPS[key]) {
			newClasses[key] = value;
		}
	});
	return newClasses;
};

const generateDisconnectedStyles = makeStyles((/* theme */) => {
	return {
		root: {},
	};
});

const generateConnectedStyles = makeStyles((/* theme */) => {
	return {
		root: {
			textTransform: 'none',
			position: 'relative',
		},
		dropdown: {
			width: '12rem',
			position: 'absolute',
			right: 0,
		},
		backdrop: {
			zIndex: 1,
			backgroundColor: 'rgba(0, 0, 0, 0.9)',
		},
	};
});

const generateEndIconStyles = makeStyles((/* theme */) => {
	return {
		root: {
			width: '1.25em',
			height: '1.25em',
			marginLeft: '-8px',
			marginRight: '-4px',
		},
	};
});

const generateStartIconStyles = makeStyles(theme => {
	return {
		root: {
			width: '0.8em',
			height: '0.8em',
			color: theme?.palette?.primary?.main ?? theme?.palette?.green['500'],
		},
	};
});

// when invoked with `props`, makeStyles will merge the parent styles
const generateBoxStyles = makeStyles(theme => {
	return {
		root: {
			display: 'flex',
			flexDirection: 'column',
			textAlign: 'center',
			zIndex: 2,
		},
		innerBoxButtonStyle: {
			backgroundColor: theme?.palette?.text?.primary || '#000000',
			color: theme?.palette?.background?.light || '#FFFFFF',
			borderRadius: '4px',
			padding: '1.25rem',
		},
		innerBox: {
			backgroundColor: theme?.palette?.text?.primary || '#000000',
			color: theme?.palette?.background?.light || '#FFFFFF',
			borderRadius: '6px',
			padding: '3rem 0.4rem',
			minWidth: '25rem',
		},
		icon: {
			width: '4rem',
			height: '4rem',
			verticalAlign: 'middle',
		},
		iconConnected: {
			width: '3rem',
			height: '3rem',
			verticalAlign: 'middle',
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
			paddingTop: '1rem',
			color: theme?.palette?.text?.secondaryInverted || '#212121',
		},
		description: {
			color: theme?.palette?.text?.secondaryInverted || '#212121',
			fontSize: '1rem',
		},
		addresDescription: {
			color: theme?.palette?.text?.primaryInverted || '#000000',
			fontSize: '0.9rem',
			marginTop: '1rem',
		},
		buttonStyleBtn: {
			// className that is set on the button (buttonStyle); can be overruled by user
			marginTop: '1rem',
			backgroundColor: '#00E676',
			color: '#000000',
			letterSpacing: '1.25px',
			padding: '6px 16px',
			'&:hover': {
				backgroundColor: '#00DB59',
			},
		},
		btn: {
			marginTop: '1rem',
			backgroundColor: '#00E676',
			color: '#000000',
			letterSpacing: '1.25px',
			padding: '6px 16px',
			'&:hover': {
				backgroundColor: '#00DB59',
				textDecoration: 'none',
			},
		},
		btnButtonStyle: {
			width: '100%',
			backgroundColor: '#00E676',
			color: '#000000',
			letterSpacing: '1.25px',
			padding: '6px 16px',
			'&:hover': {
				backgroundColor: '#00DB59',
			},
		},
		downloadDescription: {
			marginTop: '1.5rem',
			fontSize: '1rem',
		},
		copied: {
			padding: theme.spacing(1, 4),
			color: theme?.palette?.text?.primaryInverted || '#000000',
			backgroundColor: theme?.palette?.background?.main || '#FFFFFF',
		},
		iconBox: {
			display: 'flex',
			justifyContent: 'space-evenly',
			margin: '1.5rem 0 1rem',
			'& a': {
				color: theme?.palette?.text?.secondaryInverted || '#212121',
			},
			'& a:hover': {
				textDecoration: 'none',
				color: theme?.palette?.text?.primaryInverted || '#000000',
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
		selectPaper: {
			backgroundColor: '#000',
		},
		selectRoot: {
			paddingTop: '0.6rem',
			paddingBottom: '0.6rem',
		},
	};
});

// const wrongNetwork = false;
// const address = null;
// const address = '0x93B22a79CBC3cFEa495004Cba3eE8BF6abE37a99';
const shortenAddress = (address, countLeft, countRight) => {
	if (!address) {
		address = '';
	}
	return (
		address.substr(0, countLeft) +
		'...' +
		address.substr(address.length - countRight)
	);
};

const WalletConnectButton = props => {
	const {
		addressChars,
		addressCharsLeft,
		addressCharsRight,
		buttonStyle,
		buttonOpened,
		chainId,
		className,
		copyPopupStyle,
		disabled,
		disableElevation,
		disableFocusRipple,
		disableRipple,
		explorerUrls,
		labelAddressCopied,
		labelConnectMetamask,
		labelConnectWallet,
		labelCopy,
		labelDisconnect,
		labelDownload,
		labelGetStarted,
		labelNetwork,
		labelNoMetamask,
		labelViewExplorer,
		labelWrongNetwork,
		metamaskNativeAppUrl,
		networkNames,
		onAddressCopied,
		onConnect,
		onDisconnect,
		onToggle,
		onWrongNetwork,
		suggestDownloadMetamask,
		timeoutCopyPopup,
		variant,
	} = props;

	const {
		address,
		chainId: mmChainId,
		connect,
		disconnect,
		installed: metamaskInstalled,
		switchToNetwork,
	} = useMetamask();
	const timeout = useRef();
	const metamaskBoxRef = useRef();
	const metamaskBoxOutsideRef = useRef();
	const closedFromOutside = useRef(false);
	const copyContainerRef = useRef();
	const [popupId, setPopupId] = useState();
	const [selectedNetwork, setSelectNetwork] = useState('');
	const validChainIds = Array.isArray(chainId) ? chainId : [chainId];
	const wrongNetwork = !validChainIds.includes(mmChainId);
	const isConnected = !wrongNetwork && address;
	const boxClasses = generateBoxStyles(props);
	let connectedBox;
	let button;
	let buttonOpenNativeMetamask;
	let label;

	const handleConnect = async e => {
		e.currentTarget.blur();
		try {
			if (wrongNetwork) {
				onWrongNetwork(chainId);
			} else if (buttonStyle && address) {
				if (closedFromOutside.current) {
					closedFromOutside.current = false; // reset
				} else {
					props.onToggle(e);
				}
			} else {
				await connect();
				onConnect(e);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const handleDisconnect = async e => {
		e.currentTarget.blur();
		try {
			await disconnect();
		} catch (err) {
			console.error(err);
		}
		onDisconnect(e);
	};

	const handleClickOutside = e => {
		const metamaskBoxNode = metamaskBoxRef.current;
		const metamaskBoxOutsideNode = metamaskBoxOutsideRef.current;
		if(buttonStyle
		&& metamaskBoxNode
		&& metamaskBoxOutsideNode) {
			if(metamaskBoxNode.contains(e.target)) {
				closedFromOutside.current = true;
			}
			// click outside the dropdown
			if(metamaskBoxOutsideNode.contains(e.target)
			&& !metamaskBoxNode.contains(e.target)) {
				closedFromOutside.current = false;
				onToggle(e);
			}
		}
	};

	const copyAddress = async e => {
		if (address) {
			const success = await copyToClipboard(address);
			if (copyPopupStyle) {
				setPopupId(copyPopupStyle);
				timeout.current = setTimeout(() => {
					setPopupId(null);
				}, timeoutCopyPopup);
			}
			onAddressCopied(address, success);
		}
	};

	const handleCopyAddressClose = () => {
		setPopupId(null);
	};

	const handleNetworkChange = e => {
		const value = e.target.value;
		setSelectNetwork(value);
		switchToNetwork(value);
	}

	const getExplorerUrl = () => {
		if (!mmChainId || !explorerUrls[mmChainId]) {
			return '';
		}
		return `${explorerUrls[mmChainId]}/address/${address}`;
	}

	useEffect(() => {
		return () => {
			clearTimeout(timeout.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// make the select to close if clicked outside
	useEffect(() => {
		if(buttonStyle && !buttonOpened){
			document.addEventListener('mousedown', handleClickOutside, true);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside, true);
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if(mmChainId){
			setSelectNetwork(mmChainId)
		}
	}, [mmChainId]);

	// Box style connected:
	if (isConnected) {
		let network;
		let classNameInnerBox;
		let classNameButton;
		let metamaskText;
		let addressText;
		let copyText;
		let viewText;
		if (buttonStyle) {
			classNameInnerBox = boxClasses.innerBoxButtonStyle;
			classNameButton = boxClasses.btnButtonStyle;
			addressText = shortenAddress(
				address,
				addressChars ?? addressCharsLeft,
				addressChars ?? addressCharsRight,
			);
		} else {
			classNameInnerBox = boxClasses.innerBox;
			classNameButton = boxClasses.btn;
			addressText = address;
			copyText = <span>{labelCopy}</span>;
			viewText = <span>{labelViewExplorer}</span>;
		}
		if (labelNetwork) {
			network = <p className={boxClasses.titleNetwork}>{labelNetwork}</p>;
		}
		if (!buttonStyle) {
			metamaskText = <span className={boxClasses.titleMetaMask}>metamask</span>;
		}
		label = wrongNetwork ? labelWrongNetwork : labelDisconnect;

		const menuItems = Object.keys(networkNames).map(chainid => {
			const name = networkNames[chainid];
			const value = parseInt(chainid, 10);
			return (<MenuItem value={value} key={name}>{name}</MenuItem>)
		});

		const popoverCopyAddressContent = (
			<Popover
				id={popupId}
				open={!!popupId}
				anchorEl={copyContainerRef.current}
				onClose={handleCopyAddressClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
			>
				<Box className={boxClasses.copied}>{labelAddressCopied}</Box>
			</Popover>
		);

	const selectNetwork = (
			<Box>
				<Select
					value={selectedNetwork}
					onChange={handleNetworkChange}
					MenuProps={{ classes: { paper: boxClasses.selectPaper, },
						variant: 'menu'
					}}
					className={boxClasses.select}
					classes={{
						root: boxClasses.selectRoot,
					}}
					variant="outlined"
					>
					{menuItems}
				</Select>
			</Box>
		);

		connectedBox = (
			<div className={clsx(boxClasses.root, 'metamask-connected', className)}>
				<div className={classNameInnerBox} ref={metamaskBoxRef}>
					<MetamaskLogo className={boxClasses.iconConnected} />
					{metamaskText}
					{selectNetwork}
					<p className={boxClasses.addresDescription}>{addressText}</p>
					<div className={boxClasses.iconBox}>
						<div
							className={boxClasses.iconBoxInner}
							onClick={copyAddress}
							ref={copyContainerRef}
						>
							<div component="span" mr={1} my="auto">
								<FileCopyOutlinedIcon />
							</div>
							{copyText}
						</div>

						<Link href={getExplorerUrl()} target="_blank" rel="noopener">
							<div className={boxClasses.iconBoxInner}>
								<div component="span" mr={1} my="auto">
									<LaunchOutlinedIcon />
								</div>
								{viewText}
							</div>
						</Link>
					</div>
					<Button
						className={classNameButton}
						disableElevation
						onClick={handleDisconnect}
					>
						{label}
					</Button>
				</div>
				{popoverCopyAddressContent}
			</div>
		);
	}

	const btnClasses = isConnected
		? generateConnectedStyles()
		: generateDisconnectedStyles();

	if (isMobile && !metamaskInstalled) {
		buttonOpenNativeMetamask = (
			<Link
				className={clsx(boxClasses.btn, btnClasses.buttonStyleBtn)}
				classes={safeClasses(btnClasses)}
				component={Button}
				disabled={disabled}
				disableElevation={disableElevation}
				disableFocusRipple={disableFocusRipple}
				disableRipple={disableRipple}
				href={metamaskNativeAppUrl}
				onClick={handleConnect}
				target="_blank"
				variant={variant}
			>
				{labelConnectWallet}
			</Link>
		);
	}

	if (buttonStyle) {
		if (buttonOpenNativeMetamask) {
			return <div className={btnClasses.root}>{buttonOpenNativeMetamask}</div>;
		}

		let endIcon;
		let startIcon;
		let styles;
		const endIconClasses = generateEndIconStyles();
		const startIconClasses = generateStartIconStyles();
		if (!wrongNetwork && address) {
			endIcon = <ArrowDropDown classes={safeClasses(endIconClasses)} />;
			startIcon = <FiberManualRecord classes={safeClasses(startIconClasses)} />;
		}

		if (!buttonOpened || !isConnected) {
			styles = { display: 'none' };
		}

		label = isConnected
			? shortenAddress(
					address,
					addressChars ?? addressCharsLeft,
					addressChars ?? addressCharsRight,
			  )
			: labelConnectWallet;

		return (
			<div className={btnClasses.root}>
				<Button
					className={btnClasses.buttonStyleBtn}
					classes={safeClasses(btnClasses)}
					disabled={disabled}
					disableElevation={disableElevation}
					disableFocusRipple={disableFocusRipple}
					disableRipple={disableRipple}
					endIcon={endIcon}
					onClick={handleConnect}
					startIcon={startIcon}
					variant={variant}
				>
					{label}
				</Button>
				<Backdrop
				className={btnClasses.backdrop}
				open={buttonOpened}
				/>
				<div className={btnClasses.dropdown} ref={metamaskBoxOutsideRef} style={styles}>
					{connectedBox}
				</div>
			</div>
		);
	}

	if (isConnected) {
		return connectedBox;
	}

	let downloadMetamask;
	if (suggestDownloadMetamask) {
		downloadMetamask = (
			<div className={boxClasses.downloadDescription}>
				{labelNoMetamask}{' '}
				<Link href="https://metamask.io/download.html">{labelDownload}</Link>
			</div>
		);
	}

	// Box style not connected:
	button = buttonOpenNativeMetamask || (
		<Button
			className={boxClasses.btn}
			disabled={disabled}
			disableElevation={disableElevation}
			disableFocusRipple={disableFocusRipple}
			disableRipple={disableRipple}
			onClick={handleConnect}
			variant={variant}
		>
			{labelConnectMetamask}
		</Button>
	);
	return (
		<div className={clsx(boxClasses.root, className)}>
			<div className={boxClasses.innerBox}>
				<MetamaskLogo className={boxClasses.icon} />
				<p className={boxClasses.title}>{labelConnectWallet}</p>
				<p className={boxClasses.description}>{labelGetStarted}</p>
				{button}
			</div>
			{downloadMetamask}
		</div>
	);
};

WalletConnectButton.defaultProps = {
	addressChars: null,
	addressCharsLeft: 5,
	addressCharsRight: 5,
	buttonStyle: false,
	buttonOpened: false,
	className: null,
	copyPopupStyle: 'contentcopy-popover',
	explorerUrls: null,
	labelAddressCopied: 'address is copied to clipboard',
	labelConnectMetamask: 'connect to metamask',
	labelConnectWallet: 'Connect wallet',
	labelCopy: 'copy address',
	labelDisconnect: 'disconnect',
	labelDownload: 'Download',
	labelGetStarted: 'To get started, connect your wallet',
	labelNetwork: null,
	labelNoMetamask: "Don't have Metamask?",
	labelViewExplorer: 'view in explorer',
	labelWrongNetwork: 'wrong network',
	metamaskNativeAppUrl: '',
	networkNames: [],
	onAddressCopied: NOOP,
	onConnect: NOOP,
	onDisconnect: NOOP,
	onToggle: NOOP,
	onWrongNetwork: NOOP,
	suggestDownloadMetamask: true,
	timeoutCopyPopup: 400,
};

WalletConnectButton.propTypes = {
	addressChars: PropTypes.number,
	addressCharsLeft: PropTypes.number,
	addressCharsRight: PropTypes.number,
	buttonStyle: PropTypes.bool,
	buttonOpened: PropTypes.bool,
	className: PropTypes.string,
	chainId: PropTypes.oneOfType([PropTypes.number, PropTypes.array]).isRequired,
	copyPopupStyle: PropTypes.string,
	explorerUrls: PropTypes.object,
	labelAddressCopied: PropTypes.string,
	labelConnectMetamask: PropTypes.string,
	labelConnectWallet: PropTypes.string,
	labelCopy: PropTypes.string,
	labelDisconnect: PropTypes.string,
	labelDownload: PropTypes.string,
	labelGetStarted: PropTypes.string,
	labelNetwork: PropTypes.string,
	labelNoMetamask: PropTypes.string,
	labelViewExplorer: PropTypes.string,
	labelWrongNetwork: PropTypes.string,
	metamaskNativeAppUrl: PropTypes.string,
	networkNames: PropTypes.object,
	onAddressCopied: PropTypes.func,
	onConnect: PropTypes.func,
	onDisconnect: PropTypes.func,
	onToggle: PropTypes.func,
	onWrongNetwork: PropTypes.func,
	suggestDownloadMetamask: PropTypes.bool,
	timeoutCopyPopup: PropTypes.number,
};

export default WalletConnectButton;
