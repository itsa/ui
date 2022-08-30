import { toPairs } from 'lodash';

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

export const shortenAddress = (address, countLeft, countRight) => {
	if (!address) {
		address = '';
	}
	return (
		address.substr(0, countLeft) +
		'...' +
		address.substr(address.length - countRight)
	);
};

export const safeClasses = classes => {
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

export const capitalizeFirstCharacter = text => text.length ? text[0].toUpperCase() + text.substring(1) : '';

export const NOOP = () => {};
