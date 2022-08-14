// @ts-nocheck
import React, { useEffect, useRef, useState, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { isMobile, cryptowalletCtx, copyToClipboard } from '@itsa.io/web3utils';
import { Button, Link, Box, Select, MenuItem, List, ListItem, ListItemIcon, ListItemText, IconButton, Popover, Backdrop, Avatar as TokenImg } from '@material-ui/core';
import { FileCopyOutlined as FileCopyOutlinedIcon, LaunchOutlined as LaunchOutlinedIcon, FiberManualRecord as FiberManualRecordIcon, ArrowDropDown as ArrowDropDownIcon, Close as CloseIcon } from '@material-ui/icons';
import WalletLogo from './icons/Wallet';
import BraveBrowserLogo from './icons/BraveBrowser';
import MetamaskLogo from './icons/Metamask';
import LedgerLogo from './icons/Ledger';
import { shortenAddress, safeClasses, NOOP } from './helpers';
import generateConnectedStyles from './styles/connected';
import generateDisconnectedStyles from './styles/disconnected';
import generateBoxStyles from './styles/box';

const WalletConnectButton = props => {
	const {
		addressChars,
		addressCharsLeft,
		addressCharsRight,
		shortAddress,
		shortTextIcon,
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
		networkIcons,
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
		wallet,
		setWallet,
	} = useContext(cryptowalletCtx);

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
	let selectNetwork;
	let connectedBox;
	let buttonOpenNativeMetamask;
	let label;

	const handleConnect = async (walletType, e) => {
		e.currentTarget.blur();
		try {
			setWallet(walletType);
			if (wrongNetwork) {
				onWrongNetwork(chainId);
			} else {
				if (walletType === 'metamask' && metamaskInstalled) { // connect if Metamask installed
					await connect();
					onConnect(e);
				}
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
		props.onToggle(e);
	}

	const getExplorerUrl = () => {
		if (!mmChainId || !explorerUrls[mmChainId]) {
			return '';
		}
		return `${explorerUrls[mmChainId]}/address/${address}`;
	}

	// make the select to close if clicked outside
	useEffect(() => {
		return () => {
			clearTimeout(timeout.current);
		};
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
		let classNameButton;
		let metamaskText;
		let addressText = address;
		let copyText;
		let viewText;
		classNameButton = boxClasses.btn;
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
			network = <div className={boxClasses.titleNetwork}>{labelNetwork}</div>;
		}
		metamaskText = <span className={boxClasses.titleMetaMask}>metamask</span>;
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
						// disabled={!ITSA_SUBSCRIPTION_SC_ADDRESSES[chainid]}
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

		connectedBox = (
			<>
				<MetamaskLogo className={boxClasses.networkIconConnected} />
				{metamaskText}
				{network}
				{selectNetwork}
				<p className={boxClasses.addressDescription}>{addressText}</p>
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
{/*				<Button
					className={classNameButton}
					disableElevation
					onClick={handleDisconnect}
				>
					{label}
				</Button>
*/}			{popoverCopyAddressContent}
			</>
		);
	}

	const btnClasses = isConnected
		? generateConnectedStyles()
		: generateDisconnectedStyles();

	const walletButtonEnabled = !isMobile || metamaskInstalled;
	let styleButtonOpenNativeMetamask;
	let styleButton;
	if (walletButtonEnabled) {
		styleButtonOpenNativeMetamask = {display: 'none'};
	}
	else {
		styleButton = {display: 'none'};
	}
	// Note: `buttonOpenNativeMetamask` ALWAYS needs to be rendered;
	// otherwise, when conditionally rendered, on mobile, the browser could throw
	// an error complaining about changing hooks
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
			style={styleButtonOpenNativeMetamask}
			variant={variant}
		>
			{labelConnectWallet}
		</Link>
	);

	if (isConnected) {
		return (
				<div className={clsx(boxClasses.root, 'metamask-connected', className)}>
					{connectedBox}
				</div>
			);
	}

	let downloadMetamask;
	if (suggestDownloadMetamask) {
		downloadMetamask = (
			<div className={boxClasses.downloadDescription}>
				{labelNoMetamask}{' '}
				<Link href="https://metamask.io/download.html" target="_blank" rel="noreferrer noopener">{labelDownload}</Link>
			</div>
		);
	}

	return (
		<div className={clsx(boxClasses.root, className)}>
				<WalletLogo className={boxClasses.walletMainImage} />
				<p className={boxClasses.title}>{labelConnectWallet}</p>
				<div className={boxClasses.walletsContainer}>
					<Button className={clsx(boxClasses.walletsContainerItem, {
								[boxClasses.walletIconConnected]: wallet === 'ledger',
							})} onClick={handleConnect.bind(null, 'ledger')}>
						<LedgerLogo className={clsx(boxClasses.walletIcon, boxClasses.ledgerIcon)} />
					</Button>
					<Button className={clsx(boxClasses.walletsContainerItem, {
								[boxClasses.walletIconConnected]: wallet === 'brave',
							})} onClick={handleConnect.bind(null, 'brave')}>
						<BraveBrowserLogo className={boxClasses.walletIcon} />
						<p className={boxClasses.description}>Brave Browser</p>
					</Button>
					<Button className={clsx(boxClasses.walletsContainerItem, {
								[boxClasses.walletIconConnected]: wallet === 'metamask',
							})} onClick={handleConnect.bind(null, 'metamask')}>
						<MetamaskLogo className={boxClasses.walletIcon} />
						<p className={boxClasses.description}>MetaMask</p>
					</Button>
				</div>
				<p className={boxClasses.description}>{labelGetStarted}</p>
				{/* <Button
					className={boxClasses.btn}
					disabled={disabled}
					disableElevation={disableElevation}
					disableFocusRipple={disableFocusRipple}
					disableRipple={disableRipple}
					onClick={handleConnect}
					style={styleButton}
					variant={variant}
				>
					{labelConnectMetamask}
				</Button> */}
				{buttonOpenNativeMetamask}
			{downloadMetamask}
		</div>
	);
};

WalletConnectButton.defaultProps = {
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
	networkIcons: {},
	networkNames: {},
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
	buttonOpened: PropTypes.bool,
	shortAddress: PropTypes.bool,
	shortTextIcon: PropTypes.bool,
	chainId: PropTypes.oneOfType([PropTypes.number, PropTypes.array]).isRequired,
	className: PropTypes.string,
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
	networkIcons: PropTypes.object,
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
