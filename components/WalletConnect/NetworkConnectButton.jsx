// @ts-nocheck
import React, { useEffect, useRef, useState, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { cryptowalletCtx, copyToClipboard, managedPromise } from '@itsa.io/web3utils';
import { Button, Link, Box, Select, MenuItem, List, ListItem, ListItemIcon, ListItemText, IconButton, Popover, Backdrop, Avatar as TokenImg } from '@material-ui/core';
import { FileCopyOutlined as FileCopyOutlinedIcon, LaunchOutlined as LaunchOutlinedIcon, FiberManualRecord as FiberManualRecordIcon, ArrowDropDown as ArrowDropDownIcon, ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon, Close as CloseIcon } from '@material-ui/icons';
import MetamaskLogo from './icons/Metamask';
import BraveLogo from './icons/BraveBrowser';
import { shortenAddress, safeClasses, NOOP, usesMobileAppWallet } from './helpers';
import generateConnectedStyles from './styles/connected';
import generateDisconnectedStyles from './styles/disconnected';
import generateEndIconStyles from './styles/end-icon';
import generateStartIconConnectedStyles from './styles/start-icon-connected';
import generateStartIconDisconnectedStyles from './styles/start-icon-disconnected';
import generateBoxStyles from './styles/box';
import LedgerIcon from './icons/LedgerIcon';
import BraveIcon from './icons/BraveBrowser';
import MetamaskIcon from './icons/Metamask';
import generateSelectDeviceStyles from './styles/select-device';

const PLACEHOLDER_ADDRESS = ''; // must be defined, we need 5 addressboxes, which should be empty when no more addresses in `accounts`

const NetworkConnectButton = props => {
	const {
		addressBook,
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
		labelAddresses,
		labelAddressCopied,
		labelCopy,
		labelDisconnect,
		labelDisconnectHardware,
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
		onMessage,
		onToggle,
		timeoutCopyPopup,
		variant,
	} = props;

	const {
		activated,
		address,
		accounts,
		initialized,
		chainId,
		connect,
		wallet,
		hardwareWallet,
		disconnect,
		networkConnected,
		installed: metamaskInstalled,
		switchToNetwork,
		switchToAddress,
		readHardwareAccounts,
		hardwareStatus,
		hardwareAddressIndex,
		setSelectHardwareDeviceFn,
		cancelReadHardwareAccounts,
	} = useContext(cryptowalletCtx);

	const timeout = useRef();
	const metamaskBoxRef = useRef();
	const metamaskBoxOutsideRef = useRef();
	const closedFromOutside = useRef(false);
	const copyContainerRef = useRef();
	const buttonOpenedRef = useRef(buttonOpened);
	const selectHardwareWalletRef = useRef();
	const [popupId, setPopupId] = useState();
	const [addressPage, setAddressPage] = useState(Math.max(0, Math.floor(hardwareAddressIndex / 5)));
	const [selectedNetwork, setSelectNetwork] = useState('');
	const boxClasses = generateBoxStyles(props);
	const selectDeviceClasses = generateSelectDeviceStyles(props);
	const [askHardwareDevice, setAskHardwareDevice] = useState();
	const showAskHardwareDevice = Array.isArray(askHardwareDevice) && askHardwareDevice.length > 1;
	let selectNetwork;
	let connectedBox;
	let label;
	let selectHardwareDevice;

	const selectHardwareWallet = (items) => {
		selectHardwareWalletRef.current = managedPromise();
		setAskHardwareDevice(items);
		return selectHardwareWalletRef.current;
	}

	const chooseHardwareDevice = index => {
		setAskHardwareDevice(null);
		selectHardwareWalletRef.current.fulfill(index);
	};

	if (showAskHardwareDevice) {
		const items = askHardwareDevice.map((name, index) => {
			return (
				<ListItem
					button
					className={clsx(selectDeviceClasses.listItem)}
					onClick={() => chooseHardwareDevice(index)}
					key={index}>
					<ListItemIcon>
						<LedgerIcon className={selectDeviceClasses.ledgerIcon} />
					</ListItemIcon>
					<ListItemText className={selectDeviceClasses.iconText} primary={name} />
				</ListItem>
			);
		});

		selectHardwareDevice = (
			<List className={selectDeviceClasses.listIcons}>
				{items}
			</List>
		);
	}

	const setCurrentPage = () => {
		setAddressPage(Math.max(0, Math.floor(hardwareAddressIndex / 5)));
	}

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
				cancelReadHardwareAccounts();
				setCurrentPage();
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
			if (hardwareWallet && accounts.length < (addressPage + 1) * 5) {
				readHardwareAccounts(value, (addressPage + 1) * 5);
			}
			if (!hardwareWallet || address) {
				closedFromOutside.current = false;
				if (buttonOpened) {
					props.onToggle();
				}
			}
		}
		catch (err) {
			console.error(err);
		}
	}

	const handleAddressChange = async (i, address) => {
		try {
			await switchToAddress(address);
			closedFromOutside.current = false;
			cancelReadHardwareAccounts();
			if (buttonOpened) {
				props.onToggle();
			}
		}
		catch (err) {}
	}

	const gotoAddressPage = page => {
		readHardwareAccounts(chainId, (page + 1) * 5);
		setAddressPage(page);
	}

	const getExplorerUrl = () => {
		if (!chainId || !explorerUrls[chainId]) {
			return '';
		}
		return `${explorerUrls[chainId]}/address/${address}`;
	}

	// make the select to close if clicked outside
	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside, true);
		setSelectHardwareDeviceFn(selectHardwareWallet);
		return () => {
			clearTimeout(timeout.current);
			document.removeEventListener('mousedown', handleClickOutside, true);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (chainId) {
			setSelectNetwork(chainId)
		}
	}, [chainId]);

	useEffect(() => {
		buttonOpenedRef.current = buttonOpened;
		if (buttonOpened && hardwareWallet && chainId  && accounts.length < (addressPage + 1) * 5) {
			readHardwareAccounts(chainId, (addressPage + 1) * 5);
		}
	}, [buttonOpened]);

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
	label = hardwareWallet ? labelDisconnectHardware : labelDisconnect;

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

    if (hardwareWallet && chainId) {
		const shownAccounts = cloneDeep(accounts.slice(addressPage * 5, (addressPage + 1) * 5));
		for (let i = 0; i < 5; i++) {
			if (!shownAccounts[i]) {
				shownAccounts[i] = PLACEHOLDER_ADDRESS;
			}
		}
		const menuItemItems = shownAccounts.map((item, i) => (
			<ListItem
				button
				className={clsx(boxClasses.listItem, boxClasses.listItemAddress, {
					[boxClasses.listItemActive]: address === item,
				})}
				onClick={() => handleAddressChange(i, item)}
				key={item === PLACEHOLDER_ADDRESS ? i : item}>
				<ListItemText primary={item} />
			</ListItem>
		));

		let textAddressList;
		const requiredCount = (addressPage + 1) * 5;
		const ledgerWarning = (hardwareStatus !== 0) && (accounts.length < requiredCount) && !!chainId;
		if (!chainId) {
			textAddressList = labelAddresses;
		} else if (shownAccounts.filter(item => !!item).length === 5) {
			textAddressList = labelChooseAddress;
		} else {
			textAddressList = ledgerWarning ? labelSelectEthApp : labelAddresses;
		}
		addressDesc = (
			<div className={boxClasses.addressContainer}>
				<IconButton className={boxClasses.iconButton} disabled={addressPage === 0} onClick={() => gotoAddressPage(addressPage - 1)}>
					<ArrowLeftIcon />
				</IconButton>
				<p className={clsx(boxClasses.hardwareAddressDescription, {
					[boxClasses.noApp]: ledgerWarning
				})}>{textAddressList}</p>
				<IconButton className={boxClasses.iconButton} disabled={accounts.length < requiredCount} onClick={() => gotoAddressPage(addressPage + 1)}>
					<ArrowRightIcon />
				</IconButton>
			</div>
		);

		addressPicker = (
			<List className={boxClasses.addressPicker}>
				{menuItemItems}
			</List>
		);
	} else {
		addressDesc = (
			<p className={boxClasses.addressDescription}>{addressText}</p>
		);
	}

	let mainLogo;
	if (wallet === 'brave') {
		mainLogo = <BraveLogo className={boxClasses.networkIconConnected} />;
	} else {
		mainLogo = <MetamaskLogo className={boxClasses.networkIconConnected} />;
	}

	let buttonDisconnect;
	if (!usesMobileAppWallet) {
		buttonDisconnect = (
			<Button
				className={classNameButton}
				disableElevation
				onClick={handleDisconnect}
			>
				{label}
			</Button>
		);
	}

	connectedBox = (
		<>
			{mainLogo}
			{network}
			{selectNetwork}
			{addressDesc}
			{addressPicker}
			<div className={boxClasses.iconBox}>
				<div
					className={clsx(boxClasses.iconBoxInner, {
						[boxClasses.iconBoxInnerDisabled]: !address
					})}
					onClick={address ? copyAddress : NOOP}
					ref={copyContainerRef}
				>
					<div component="span" my="auto">
						<FileCopyOutlinedIcon />
					</div>
					{copyText}
				</div>

				<Link href={address ? getExplorerUrl() : '#'} target="_blank" rel="noopener">
					<div className={clsx(boxClasses.iconBoxInner, {
						[boxClasses.iconBoxInnerDisabled]: !address
					})}>
						<div component="span" my="auto">
							<LaunchOutlinedIcon />
						</div>
						{viewText}
					</div>
				</Link>
			</div>
			{buttonDisconnect}
			{popoverCopyAddressContent}
		</>
	);

	// const btnClasses = isConnected
	const btnClasses = (buttonOpened || !networkConnected)
		? generateConnectedStyles()
		: generateDisconnectedStyles();

	let endIcon;
	let startIcon;
	let styles;
	const endIconClasses = generateEndIconStyles();
	const startIconClasses = networkConnected ? generateStartIconConnectedStyles() : generateStartIconDisconnectedStyles();
	if (networkConnected) {
		if (wallet === 'ledger') {
			endIcon = <LedgerIcon className={boxClasses.addressIconLedger} />;
		}
		else if (wallet === 'ledgerbt') {
			endIcon = (
				<>
					<LedgerIcon className={boxClasses.addressIconLedger} />
					<div className={boxClasses.bluetoothMarker}>BT</div>
				</>
			);
		} else if (wallet === 'brave') {
			endIcon = <BraveIcon className={boxClasses.addressIconBrave} />;
		} else if (wallet === 'metamask') {
			endIcon = <MetamaskIcon className={boxClasses.addressIconMetamask} />;
		} else {
			endIcon = <ArrowDropDownIcon classes={safeClasses(endIconClasses)} />;
		}
	}
	startIcon = <FiberManualRecordIcon classes={safeClasses(startIconClasses)} />;

	const handleCloseIcon = e => {
		closedFromOutside.current = false;
		cancelReadHardwareAccounts();
		setCurrentPage();
		props.onToggle(e);
	}

	if (!initialized || (!buttonOpened && networkConnected)) {
		styles = {display: 'none'};
	}

	label = addressBook[address?.toLowerCase()] || shortenAddress(
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
				// style={styleButton}
				variant={variant}
			>
				<div className={boxClasses.buttonStyleBtnLabel}>{label}</div>
			</Button>
		);
	}

	let content;
	if (showAskHardwareDevice) {
		content = selectHardwareDevice;
	} else {
		content = (
			<div className={clsx(boxClasses.root, boxClasses.noOverflowX, 'metamask-connected', className)} ref={metamaskBoxRef}>
				{closebtn}
				{connectedBox}
			</div>
		);
	}

	return (
		<>
			{addressButton}
			<Backdrop
				className={btnClasses.backdrop}
				open={showAskHardwareDevice || buttonOpened || !networkConnected}
			/>
			<div className={btnClasses.dropdown} style={styles} ref={metamaskBoxOutsideRef}>
				{content}
			</div>
		</>
	);
};

NetworkConnectButton.defaultProps = {
	addressBook: {},
	addressChars: null,
	addressCharsLeft: 5,
	addressCharsRight: 5,
	buttonOpened: false,
	shortAddress: false,
	shortTextIcon: false,
	className: null,
	copyPopupStyle: 'contentcopy-popover',
	explorerUrls: null,
	labelAddresses: 'Addresses',
	labelAddressCopied: 'address is copied to clipboard',
	labelCopy: 'copy address',
	labelDisconnectHardware: 'choose other wallet type',
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
	onMessage: NOOP,
	onToggle: NOOP,
	timeoutCopyPopup: 400,
};

NetworkConnectButton.propTypes = {
	addressBook: PropTypes.object,
	addressChars: PropTypes.number,
	addressCharsLeft: PropTypes.number,
	addressCharsRight: PropTypes.number,
	buttonOpened: PropTypes.bool,
	shortAddress: PropTypes.bool,
	shortTextIcon: PropTypes.bool,
	className: PropTypes.string,
	copyPopupStyle: PropTypes.string,
	explorerUrls: PropTypes.object,
	labelAddresses: PropTypes.string,
	labelAddressCopied: PropTypes.string,
	labelCopy: PropTypes.string,
	labelDisconnect: PropTypes.string,
	labelDisconnectHardware: PropTypes.string,
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
	onMessage: PropTypes.func,
	onToggle: PropTypes.func,
	timeoutCopyPopup: PropTypes.number,
};

export default NetworkConnectButton;
