// @ts-nocheck
import React, { useContext, useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { isMobile, ios, cryptowalletCtx, cryptowalletDetection, later, webBluetoothDetection, hasWebUsb, websiteURL } from '@itsa.io/web3utils';
import { Button, Link } from '@material-ui/core';
import BraveBrowserLogo from './icons/BraveBrowser';
import MetamaskLogo from './icons/Metamask';
import LedgerLogo from './icons/Ledger';
import { NOOP, capitalizeFirstCharacter } from './helpers';
import generateBoxStyles from './styles/box';

const MOBILE_DELAY_RED_CONNECT_MESSAGE = 2000; // ms
const DESKTOP_DELAY_RED_CONNECT_MESSAGE = 15000; // ms -> mobile takes pretty long

const SHOW_LEDGER_USB_DESKTOP = true;
const SHOW_LEDGER_BLUETOOTH_DESKTOP = true;
const SHOW_LEDGER_USB_IOS = false; // instead of disable when not supported
const SHOW_LEDGER_BLUETOOTH_IOS = false; // instead of disable when not supported
const SHOW_LEDGER_USB_ANDROID = true;
const SHOW_LEDGER_BLUETOOTH_ANDROID = true;

let showLedgerButton;
let showLedgerBluetoothButton;

if (isMobile) {
	showLedgerButton = ios ? SHOW_LEDGER_USB_IOS : SHOW_LEDGER_USB_ANDROID;
	showLedgerBluetoothButton = ios ? SHOW_LEDGER_BLUETOOTH_IOS : SHOW_LEDGER_BLUETOOTH_ANDROID;
} else {
	showLedgerButton = SHOW_LEDGER_USB_DESKTOP;
	showLedgerBluetoothButton = SHOW_LEDGER_BLUETOOTH_DESKTOP;
}


const METAMASK_NATIVE_APP = 'https://metamask.app.link/dapp';
const BRAVE_NATIVE_APP = 'https://brave.app.link/dapp';

const WalletConnect = props => {
	const {
		className,
		labelUnlockWallet,
		labelTitle,
		labelGetStarted,
		labelDownload,
		labelNoBrave,
		labelNoMetamask,
		labelOpenInBraveMobile,
		labelOpenInMetamaskApp,
		labelWallet,
		onConnect,
	} = props;

	const {
		activate,
		connected,
		hardwareWallet,
		wallet,
		setWallet,
	} = useContext(cryptowalletCtx);

	const [braveBrowser, setBraveBrowser] = useState();
	const [helpText, setHelpText] = useState();
	const [webBluetooth, setWebBluetooth] = useState(false);
	const [webUsb, setWebUsb] = useState(false);
	const [lastClickedButton, setLastClickedButton] = useState();
	const isMounted = useRef(false);
	const timer = useRef();
	const [connectionMessageDelay, setConnectionMessageDelay] = useState(false);
	const isBraveWallet = cryptowalletDetection.isBrave;
	const hasCryptoWallet = cryptowalletDetection.hasWallet;
	const boxClasses = generateBoxStyles(props);
	const metamaskNativeAppUrl = `${METAMASK_NATIVE_APP}/${websiteURL}`;
	const braveNativeAppUrl = `${BRAVE_NATIVE_APP}/${websiteURL}`;

	const checkBraveBrowser = async() => {
		const isBrave = (navigator.brave && await navigator.brave.isBrave() || false); // https://stackoverflow.com/questions/36523448/how-do-i-tell-if-a-user-is-using-brave-as-their-browser
		if (isMounted.current) {
			setBraveBrowser(isBrave);
		}
	}

	const checkWebBluetooth = async() => {
		const hasBluetooth = await webBluetoothDetection;
		setWebBluetooth(hasBluetooth);
	};

	const checkWebUsb = () => {
		setWebUsb(hasWebUsb);
	};

	useEffect(() => {
		isMounted.current = true;
		checkBraveBrowser();
		checkWebUsb();
		checkWebBluetooth();
		return () => {
			isMounted.current = false;
			if (timer.current) {
				timer.current.cancel();
			}
		}
	}, []);

	const handleConnect = async (walletType, e) => {
		e.currentTarget.blur();
		try {
			setLastClickedButton(null);
			if (wallet !== walletType) {
				setWallet(walletType);
			}
			if (!hardwareWallet && hasCryptoWallet) { // connect if Metamask installed
				if (isMounted.current) {
					setConnectionMessageDelay(true);
				}
				// connectionMessageDelay.current = true;
				timer.current = later(() => {
					// use this to preven a quick red "connect to wallet" text
					// whenever a user selectes a cryptowallet that actually is connected
					// but still needs to be asked for the "connected" status
					// and therefore will repons with connected===false for a very short time
					if (isMounted.current) {
						setConnectionMessageDelay(false);
					}
				}, isMobile ? MOBILE_DELAY_RED_CONNECT_MESSAGE : DESKTOP_DELAY_RED_CONNECT_MESSAGE);
				await activate();
				if (isMounted.current) {
					onConnect(e);
				}
			}
	} catch (err) {
			console.error(err);
		}
	};

	const buttonAction = (type, e) => {
		e.currentTarget.blur();
		if (type === 'brave') {
			setHelpText(`${labelNoBrave} <a href="https://brave.com/" target="_blank" rel="noreferrer noopener">${labelDownload}</a>`);
		} else if (type === 'metamask') {
			setHelpText(`${labelNoMetamask} <a href="https://metamask.io/download.html" target="_blank" rel="noreferrer noopener">${labelDownload}</a>`);
		}
		setLastClickedButton(type);
	}

	let noUsbSupportMsg;
	let noBluetoothSupportMsg;
	if (!webUsb) {
		noUsbSupportMsg = (<div className={boxClasses.noBrowserSupport}>no browsersupport</div>);
	}
	if (!webBluetooth) {
		noBluetoothSupportMsg = (<div className={boxClasses.noBrowserSupport}>no browsersupport</div>);
	}

	let ledgerButton
	if (showLedgerButton) {
		ledgerButton = (
			<Button key="ledger" className={clsx(boxClasses.walletsContainerItem, {
				[boxClasses.walletIconConnected]: wallet === 'ledger' && !lastClickedButton,
			})} disabled={!webUsb} onClick={handleConnect.bind(null, 'ledger')}>
				<LedgerLogo className={clsx(boxClasses.walletIcon, boxClasses.ledgerIcon)} />
				<p className={boxClasses.description}>Hardware Wallet <span>USB</span></p>
				{noUsbSupportMsg}
			</Button>
		);
	}

	let ledgerBluetoothButton
	if (showLedgerBluetoothButton) {
		ledgerBluetoothButton = (
			<Button key="ledgerbt" className={clsx(boxClasses.walletsContainerItem, {
				[boxClasses.walletIconConnected]: wallet === 'ledgerbt' && !lastClickedButton,
			})} disabled={!webBluetooth} onClick={handleConnect.bind(null, 'ledgerbt')}>
				<LedgerLogo className={clsx(boxClasses.walletIcon, boxClasses.ledgerIcon)} />
				<p className={boxClasses.description}>Hardware Wallet <span>Bluetooth</span></p>
				{noBluetoothSupportMsg}
			</Button>
		);
	}

	let braveButton;
	if (!braveBrowser) {
		if (isMobile) {
			braveButton = (
				<Link
				    key="braveapp"
					className={boxClasses.walletsContainerItem}
					href={braveNativeAppUrl}
					target="_blank"
				>
					<BraveBrowserLogo className={boxClasses.walletIcon} />
					<p className={boxClasses.description}>{labelOpenInBraveMobile}</p>
				</Link>
			);
		} else {
			braveButton = (
				<Button key="bravebrowser" className={clsx(boxClasses.walletsContainerItem, {
					[boxClasses.walletIconConnected]: wallet === 'brave' || lastClickedButton === 'brave',
				})} onClick={buttonAction.bind(null, 'brave')}>
					<BraveBrowserLogo className={boxClasses.walletIcon} />
					<p className={boxClasses.description}>Brave Wallet</p>
				</Button>
			);
		}
	}

	let extentionButton;
	if (isBraveWallet) {
		extentionButton = (
			<Button key="bravewallet" className={clsx(boxClasses.walletsContainerItem, {
				[boxClasses.walletIconConnected]: wallet === 'brave' && !lastClickedButton,
			})} onClick={handleConnect.bind(null, 'brave')}>
				<BraveBrowserLogo className={boxClasses.walletIcon} />
				<p className={boxClasses.description}>Brave Wallet</p>
			</Button>
		);
	} else if (!isMobile) {
		if (hasCryptoWallet) {
			extentionButton = (
				<Button key="metamask" className={clsx(boxClasses.walletsContainerItem, {
					[boxClasses.walletIconConnected]: wallet === 'metamask' && !lastClickedButton,
				})} onClick={handleConnect.bind(null, 'metamask')}>
					<MetamaskLogo className={boxClasses.walletIcon} />
					<p className={boxClasses.description}>MetaMask</p>
				</Button>
			);
		} else {
			extentionButton = (
				<Button key="metamaskextention" className={clsx(boxClasses.walletsContainerItem, {
					[boxClasses.walletIconConnected]: wallet === 'metamask' || lastClickedButton === 'metamask',
				})} onClick={buttonAction.bind(null, 'metamask')}>
					<MetamaskLogo className={boxClasses.walletIcon} />
					<p className={boxClasses.description}>MetaMask</p>
				</Button>
			);
		}
	}

	let metamaskMobileAppButton;
	if (isMobile && (!hasCryptoWallet || isBraveWallet)) {
		metamaskMobileAppButton = (
			<Link
				key="metamaskapp"
				className={boxClasses.walletsContainerItem}
				href={metamaskNativeAppUrl}
				target="_blank"
			>
				<MetamaskLogo className={boxClasses.walletIcon} />
				<p className={boxClasses.description}>{labelOpenInMetamaskApp}</p>
			</Link>
		);

	}

	const unConnectedWallet = !!wallet && !connected && !connectionMessageDelay;
	const connectText = unConnectedWallet ? `${labelUnlockWallet} ${capitalizeFirstCharacter(wallet)} ${labelWallet}` : labelGetStarted;

    const helpTextElement = <p className={clsx(boxClasses.downloadDescription, {
		[boxClasses.errorText]: unConnectedWallet
	})} dangerouslySetInnerHTML={{__html: helpText || connectText}} />

	// now devide the buttons:
	const buttons = [];
	if (ledgerButton) {
		buttons.push(ledgerButton);
	}
	if (ledgerBluetoothButton) {
		buttons.push(ledgerBluetoothButton);
	}
	if (braveButton) {
		buttons.push(braveButton);
	}
	if (extentionButton) {
		buttons.push(extentionButton);
	}
	if (metamaskMobileAppButton) {
		buttons.push(metamaskMobileAppButton);
	}

	const buttonCount = buttons.length;
	let shownButtons;
	if (buttonCount <= 3) {
		shownButtons = buttons;
	} else {
		let buttonRows = [];
		buttons.forEach((button, i) => {
			let lastButtonRow = buttonRows[buttonRows.length - 1];
			if (!lastButtonRow || lastButtonRow.length === 2) {
				lastButtonRow = [];
				buttonRows.push(lastButtonRow);
			}
			lastButtonRow.push(button);
		});
		// now wrapp all row-items with a div:
		shownButtons = buttonRows.map((item, i) => <div className={boxClasses.buttonRow} key={i}>{item}</div>);
	}


	return (
		<div className={clsx(boxClasses.root, className)}>
			<p className={boxClasses.title}>{labelTitle}</p>
			<div className={clsx(boxClasses.walletsContainer, {
				[boxClasses.hidden]: typeof braveBrowser !== 'boolean', // needs iinitialization
				[boxClasses.ultrawideButtons]: buttonCount === 1,
				[boxClasses.extrawideButtons]: buttonCount === 2,
				[boxClasses.wideButtons]: buttonCount === 3,
				[boxClasses.standardButtons]: buttonCount > 3,
			})}>
				{shownButtons}
			</div>
			{helpTextElement}
		</div>
	);
};

WalletConnect.defaultProps = {
	className: null,
	labelConnectMetamask: 'connect to metamask',
	labelUnlockWallet: 'Unlock your',
	labelTitle: 'Manage your Crypto',
	labelGetStarted: 'To get started, connect your wallet',
	labelDownload: 'Download here',
	labelNoBrave: "Open this Webpage in the Brave Browser. Don't have Brave Browser?",
	labelNoMetamask: "Don't have Metamask?",
	labelOpenInBraveMobile: 'Use Brave App',
	labelOpenInMetamaskApp: 'Use Metamask App',
	labelWallet: 'Wallet',
	onConnect: NOOP,
};

WalletConnect.propTypes = {
	className: PropTypes.string,
	labelUnlockWallet: PropTypes.string,
	labelTitle: PropTypes.string,
	labelWallet: PropTypes.string,
	labelGetStarted: PropTypes.string,
	labelDownload: PropTypes.string,
	labelNoBrave: PropTypes.string,
	labelNoMetamask: PropTypes.string,
	labelOpenInBraveMobile: PropTypes.string,
	labelOpenInMetamaskApp: PropTypes.string,
	onConnect: PropTypes.func,
};

export default WalletConnect;
