import { useMediaQuery as useMediaQueryOriginal } from '@material-ui/core';

export * from '@material-ui/core';
export * from '@material-ui/lab';
export * from '@material-ui/pickers';

export { default as Seo } from './Seo';
export { default as NetworkConnectButton } from './WalletConnect/NetworkConnectButton';
export { default as WalletConnect } from './WalletConnect/WalletConnect';

// redefine useMediaQuery with noSsr = true by defeault; to prevent useMediaQuery
// from returning a default initial "false" after getting its value:
export const useMediaQuery = (queryInput, options = { noSsr: true }) =>
	useMediaQueryOriginal(queryInput, options);
