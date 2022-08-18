// @ts-nocheck
import React, { useEffect, useRef, useState, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { isMobile, cryptowalletCtx, copyToClipboard, localStorageProperty } from '@itsa.io/web3utils';
import { Button, Link, Box, Select, MenuItem, List, ListItem, ListItemIcon, ListItemText, IconButton, Popover, Backdrop, Avatar as TokenImg } from '@material-ui/core';
import { FileCopyOutlined as FileCopyOutlinedIcon, LaunchOutlined as LaunchOutlinedIcon, FiberManualRecord as FiberManualRecordIcon, ArrowDropDown as ArrowDropDownIcon, Close as CloseIcon } from '@material-ui/icons';
import MetamaskLogo from './icons/Metamask';
import { shortenAddress, safeClasses, NOOP } from './helpers';
import generateConnectedStyles from './styles/connected';
import generateDisconnectedStyles from './styles/disconnected';
import generateEndIconStyles from './styles/end-icon';
import generateStartIconConnectedStyles from './styles/start-icon-connected';
import generateStartIconDisconnectedStyles from './styles/start-icon-disconnected';
import generateBoxStyles from './styles/box';

const NetworkConnectButton = props => {
	const {
		addressChars,
		addressCharsLeft,
		addressCharsRight,
		shortAddress,
		shortTextIcon,
		buttonOpened,
		className,
		copyPopupStyle,
		disabled,
		disableElevation,
		disableFocusRipple,
		disableRipple,
		explorerUrls,
		labelAddressCopied,
		labelCopy,
		labelDisconnect,
		labelNetwork,
		labelChooseAddress,
		labelChooseNetwork,
		labelSelectEthApp,
		labelViewExplorer,
		networkIcons,
		networkNames,
		onAddressCopied,
		onConnect,
		onDisconnect,
		onToggle,
		timeoutCopyPopup,
		variant,
	} = props;

	const {
		address,
		accounts,
		initialized,
		chainId,
		connect,
		hardwareWallet,
		disconnect,
		networkConnected,
		installed: metamaskInstalled,
		switchToNetwork,
		switchToAddress,
		setMessageListenerFn,
		appSelected,
	} = useContext(cryptowalletCtx);

	const timeout = useRef();
	const metamaskBoxRef = useRef();
	const metamaskBoxOutsideRef = useRef();
	const closedFromOutside = useRef(false);
	const copyContainerRef = useRef();
	const buttonOpenedRef = useRef(buttonOpened);
	const [popupId, setPopupId] = useState();
	const [selectedNetwork, setSelectNetwork] = useState('');
	const [hardwareStatus, setHardwareStatus] = useState(0);
	const boxClasses = generateBoxStyles(props);
	let selectNetwork;
	let connectedBox;
	let label;

	const handleConnect = async (e) => {
		e.currentTarget.blur();
		try {
			if (address) {
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
			closedFromOutside.current = false;
			props.onToggle(e);
			await disconnect();
		} catch (err) {
			console.error(err);
		}
		onDisconnect(e);
	};

	const handleClickOutside = e => {
		if (buttonOpenedRef.current) {
			const metamaskBoxNode = metamaskBoxRef.current;
			const metamaskBoxOutsideNode = metamaskBoxOutsideRef.current;
			if(metamaskBoxNode
			&& metamaskBoxOutsideNode
			&& metamaskBoxOutsideNode.contains(e.target)
			&& !metamaskBoxNode.contains(e.target)) {
				// click outside the dropdown
				// should have the same effect as toggling the button
				closedFromOutside.current = true;
				setTimeout(() => {
					closedFromOutside.current = false;
				}, 300);
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

	const handleNetworkChange = async e => {
		const value = e.target.value;
		setSelectNetwork(value);
		try {
			await switchToNetwork(value);
			closedFromOutside.current = false;
			if (buttonOpened) {
				props.onToggle();
			// } else {
			// 	forceUpdate();
			}
		}
		catch (err) {}
	}
	const handleAddressChange = async e => {
		const value = e.target.value;
		console.debug('handleAddressChange', value);
		// setSelectNetwork(value);
		try {
			await switchToAddress(value);
			// closedFromOutside.current = false;
			// if (buttonOpened) {
			// 	props.onToggle();
			// } else {
			// 	forceUpdate();
			// }
		}
		catch (err) {}
	}

	const getExplorerUrl = () => {
		if (!chainId || !explorerUrls[chainId]) {
			return '';
		}
		return `${explorerUrls[chainId]}/address/${address}`;
	}

	const handleHardwareWalletMessage = ({ message, level, status = 0 }) => {
		console.debug(`handleHardwareWalletMessage level ${level}: ${message} | status: ${status}`);
		setHardwareStatus(status);
	}

	// make the select to close if clicked outside
	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside, true);
		return () => {
			clearTimeout(timeout.current);
			document.removeEventListener('mousedown', handleClickOutside, true);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if(chainId){
			setSelectNetwork(chainId)
		}
	}, [chainId]);

	useEffect(() => {
		buttonOpenedRef.current = buttonOpened;
	}, [buttonOpened]);

	useEffect(() => {
		setMessageListenerFn(handleHardwareWalletMessage);
	}, []);

	let network;
	let classNameButton;
	let addressText = address;
	let copyText;
	let viewText;
	classNameButton = boxClasses.btnButtonStyle;
	if(shortAddress) {
		addressText = shortenAddress(
			address,
			addressChars ?? addressCharsLeft,
			addressChars ?? addressCharsRight,
		);
	}
	if(!shortTextIcon){
		copyText = <span>{labelCopy}</span>;
		viewText = <span>{labelViewExplorer}</span>;
	}
	if (labelNetwork) {
		if (!networkConnected) {
			network = <div className={boxClasses.titleNetwork}>{labelChooseNetwork}</div>;
		}
		else {
			network = <div className={boxClasses.titleNetwork}>{labelNetwork}</div>;
		}
	}
	label = labelDisconnect;

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

	if (Object.keys(networkIcons).length > 0) {
		const selectNetworkItems = Object.keys(networkIcons).map(chainid => {
			const name = networkNames[chainid];
			const icon = networkIcons[chainid];
			const value = parseInt(chainid, 10);

			return (
				<ListItem
					button
					className={clsx(boxClasses.listItem, {
						[boxClasses.listItemActive]: selectedNetwork === value,
					})}
					onClick={() => handleNetworkChange({ target: { value }})}
					key={chainid}>
					<ListItemIcon>
						<TokenImg
							className={boxClasses.networkIcon}
							alt={name}
							width="40"
							height="40"
							src={icon}
						>
							<TokenImg className={boxClasses.networkIconImgUnknown} alt={name} src="">
								?
							</TokenImg>
						</TokenImg>
					</ListItemIcon>
					<ListItemText primary={name} />
				</ListItem>
			);
		});
		selectNetwork = (
			<List className={boxClasses.listIcons}>
				{selectNetworkItems}
			</List>
		);
	} else {
		const menuItems = Object.keys(networkNames).map(chainid => {
			const name = networkNames[chainid];
			const value = parseInt(chainid, 10);
			return (<MenuItem value={value} key={name}>{name}</MenuItem>)
		});

		selectNetwork = (
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
		);
	}

	let addressPicker;
	let addressDesc;

    if (hardwareWallet) {
		const menuItemItems = accounts.map(item => (
			<MenuItem className={boxClasses.menuItem} key={item} value={item}>
				{item}
			</MenuItem>
		));

		addressDesc = (
			<p className={clsx(boxClasses.addressDescription, {
				[boxClasses.noApp]: hardwareStatus === 1
			})}>{hardwareStatus === 1 ? labelSelectEthApp : labelChooseAddress}</p>
		);

		addressPicker = (
			<Select
				className={boxClasses.addressPicker}
				value={address}
				onChange={handleAddressChange}
				variant="outlined"
				displayEmpty
			>
				{menuItemItems}
			</Select>
		);
	} else {
		addressDesc = (
			<p className={boxClasses.addressDescription}>{addressText}</p>
		);
	}


	connectedBox = (
		<>
			<MetamaskLogo className={boxClasses.networkIconConnected} />
			{network}
			{selectNetwork}
			{addressDesc}
			{addressPicker}
			<div className={boxClasses.iconBox}>
				<div
					className={boxClasses.iconBoxInner}
					onClick={copyAddress}
					ref={copyContainerRef}
				>
					<div component="span" my="auto">
						<FileCopyOutlinedIcon />
					</div>
					{copyText}
				</div>

				<Link href={getExplorerUrl()} target="_blank" rel="noopener">
					<div className={boxClasses.iconBoxInner}>
						<div component="span" my="auto">
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
		{popoverCopyAddressContent}
		</>
	);

	// const btnClasses = isConnected
	const btnClasses = (buttonOpened || !networkConnected)
		? generateConnectedStyles()
		: generateDisconnectedStyles();

	const walletButtonEnabled = !isMobile || metamaskInstalled;
	let styleButton;
	if (!walletButtonEnabled) {
		styleButton = {display: 'none'};
	}

	let endIcon;
	let startIcon;
	let styles;
	const endIconClasses = generateEndIconStyles();
	const startIconClasses = networkConnected ? generateStartIconConnectedStyles() : generateStartIconDisconnectedStyles();
	if (networkConnected) {
		endIcon = <ArrowDropDownIcon classes={safeClasses(endIconClasses)} />;
	}
	startIcon = <FiberManualRecordIcon classes={safeClasses(startIconClasses)} />;

	const handleCloseIcon = e => {
		closedFromOutside.current = false;
		props.onToggle(e);
	}

	if (!initialized || (!buttonOpened && networkConnected)) {
		styles = {display: 'none'};
	}

	label = shortenAddress(
		address,
		addressChars ?? addressCharsLeft,
		addressChars ?? addressCharsRight,
	);

	let closebtn;
	if (buttonOpened) {
		closebtn = (
			<IconButton className={btnClasses.iconButton} onClick={handleCloseIcon}>
				<CloseIcon />
			</IconButton>
		);
	}

	let addressButton;
	if (address) {
		addressButton = (
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
				style={styleButton}
				variant={variant}
			>
				{label}
			</Button>
		);
	}

	return (
		<>
			{addressButton}
			<Backdrop
				className={btnClasses.backdrop}
				open={buttonOpened || !networkConnected}
			/>
			<div className={btnClasses.dropdown} style={styles} ref={metamaskBoxOutsideRef}>
				<div className={clsx(boxClasses.root, 'metamask-connected', className)} ref={metamaskBoxRef}>
					{closebtn}
					{connectedBox}
				</div>
			</div>
		</>
	);
};

NetworkConnectButton.defaultProps = {
	addressChars: null,
	addressCharsLeft: 5,
	addressCharsRight: 5,
	buttonOpened: false,
	shortAddress: false,
	shortTextIcon: false,
	className: null,
	copyPopupStyle: 'contentcopy-popover',
	explorerUrls: null,
	labelAddressCopied: 'address is copied to clipboard',
	labelCopy: 'copy address',
	labelDisconnect: 'disconnect wallet',
	labelNetwork: null,
	labelChooseAddress: 'Choose your Address',
	labelChooseNetwork: 'Select a Network',
	labelSelectEthApp: 'Select Ethereum App on your Ledger',
	labelViewExplorer: 'view in explorer',
	networkIcons: {},
	networkNames: {},
	onAddressCopied: NOOP,
	onConnect: NOOP,
	onDisconnect: NOOP,
	onToggle: NOOP,
	timeoutCopyPopup: 400,
};

NetworkConnectButton.propTypes = {
	addressChars: PropTypes.number,
	addressCharsLeft: PropTypes.number,
	addressCharsRight: PropTypes.number,
	buttonOpened: PropTypes.bool,
	shortAddress: PropTypes.bool,
	shortTextIcon: PropTypes.bool,
	className: PropTypes.string,
	copyPopupStyle: PropTypes.string,
	explorerUrls: PropTypes.object,
	labelAddressCopied: PropTypes.string,
	labelCopy: PropTypes.string,
	labelDisconnect: PropTypes.string,
	labelNetwork: PropTypes.string,
	labelChooseAddress: PropTypes.string,
	labelChooseNetwork: PropTypes.string,
	labelSelectEthApp: PropTypes.string,
	labelViewExplorer: PropTypes.string,
	networkIcons: PropTypes.object,
	networkNames: PropTypes.object,
	onAddressCopied: PropTypes.func,
	onConnect: PropTypes.func,
	onDisconnect: PropTypes.func,
	onToggle: PropTypes.func,
	timeoutCopyPopup: PropTypes.number,
};

export default NetworkConnectButton;
