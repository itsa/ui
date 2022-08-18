// @ts-nocheck
import React, { useEffect, useContext, useState, useRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { isMobile, cryptowalletCtx, managedPromise } from '@itsa.io/web3utils';
import { Button, Link, Backdrop, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import WalletLogo from './icons/Wallet';
import BraveBrowserLogo from './icons/BraveBrowser';
import MetamaskLogo from './icons/Metamask';
import LedgerLogo from './icons/Ledger';
import LedgerIcon from './icons/LedgerIcon';
import { safeClasses, NOOP } from './helpers';
import generateDisconnectedStyles from './styles/disconnected';
import generateBoxStyles from './styles/box';
import generateSelectDeviceStyles from './styles/select-device';

const WalletConnect = props => {
	const {
		className,
		disabled,
		disableElevation,
		disableFocusRipple,
		disableRipple,
		labelConnectWallet,
		labelDownload,
		labelGetStarted,
		labelNoMetamask,
		metamaskNativeAppUrl,
		onConnect,
		suggestDownloadMetamask,
		variant,
	} = props;

	const {
		connect,
		installed: metamaskInstalled,
		wallet,
		setWallet,
		setSelectHardwareDeviceFn,
	} = useContext(cryptowalletCtx);

	const [askHardwareDevice, setAskHardwareDevice] = useState();
	const selectHardwarwWalletRef = useRef();

	const boxClasses = generateBoxStyles(props);
	const selectDeviceClasses = generateSelectDeviceStyles(props);
	const showAskHardwareDevice = Array.isArray(askHardwareDevice) && askHardwareDevice.length > 1;
	let buttonOpenNativeMetamask;

	const handleConnect = async (walletType, e) => {
		e.currentTarget.blur();
		try {
			if ((wallet === walletType) && (walletType === 'ledger')) {
				await connect();
			} else {
				setWallet(walletType);
				if (walletType === 'metamask' && metamaskInstalled) { // connect if Metamask installed
					await connect();
					onConnect(e);
				}
			}
			// }
		} catch (err) {
			console.error(err);
		}
	};

	const selectHardwareWallet = (items) => {
		selectHardwarwWalletRef.current = managedPromise();
		setAskHardwareDevice(items);
		return selectHardwarwWalletRef.current;
	}

	const chooseHardwareDevice = index => {
		selectHardwarwWalletRef.current.fulfill(index);
	};

	useEffect(() => {
		setSelectHardwareDeviceFn(selectHardwareWallet);
	}, [wallet]);

	useEffect(() => {
		setSelectHardwareDeviceFn(selectHardwareWallet);
	}, []);

	const btnClasses = generateDisconnectedStyles();

	const walletButtonEnabled = !isMobile || metamaskInstalled;
	let styleButtonOpenNativeMetamask;
	if (walletButtonEnabled) {
		styleButtonOpenNativeMetamask = {display: 'none'};
	}
	else {
		styleButton = {display: 'none'};
	}

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

	let downloadMetamask;
	if (suggestDownloadMetamask) {
		downloadMetamask = (
			<div className={boxClasses.downloadDescription}>
				{labelNoMetamask}{' '}
				<Link href="https://metamask.io/download.html" target="_blank" rel="noreferrer noopener">{labelDownload}</Link>
			</div>
		);
	}

	let selectHardwareDevice;
	let connectContent;

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
	} else {
		connectContent = (
			<div className={clsx(boxClasses.root, className)}>
				<WalletLogo className={boxClasses.walletMainImage} />
				<p className={boxClasses.title}>{labelConnectWallet}</p>
				<div className={boxClasses.walletsContainer}>
					<Button className={clsx(boxClasses.walletsContainerItem, {
							[boxClasses.walletIconConnected]: wallet === 'ledger',
						})} onClick={handleConnect.bind(null, 'ledger')}>
						<LedgerLogo className={clsx(boxClasses.walletIcon, boxClasses.ledgerIcon)} />
						<p className={boxClasses.description}>Hardware Wallet</p>
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
				{buttonOpenNativeMetamask}
				{downloadMetamask}
			</div>
		);
	}
	return (
		<>
			<Backdrop
				className={boxClasses.backdrop}
				open={showAskHardwareDevice}
			/>
			{connectContent}
			{selectHardwareDevice}
		</>
	);
};

WalletConnect.defaultProps = {
	className: null,
	labelConnectMetamask: 'connect to metamask',
	labelConnectWallet: 'Connect wallet',
	labelDownload: 'Download',
	labelGetStarted: 'To get started, connect your wallet',
	labelNoMetamask: "Don't have Metamask?",
	metamaskNativeAppUrl: '',
	onConnect: NOOP,
	suggestDownloadMetamask: true,
};

WalletConnect.propTypes = {
	className: PropTypes.string,
	labelConnectWallet: PropTypes.string,
	labelDownload: PropTypes.string,
	labelGetStarted: PropTypes.string,
	labelNoMetamask: PropTypes.string,
	metamaskNativeAppUrl: PropTypes.string,
	onConnect: PropTypes.func,
	suggestDownloadMetamask: PropTypes.bool,
};

export default WalletConnect;
