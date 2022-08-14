import React from 'react';
import PropTypes from 'prop-types';
import ButtonStyleConnectButton from './ButtonStyleConnectButton';
import BoxStyleConnectButton from './BoxStyleConnectButton';

const WalletConnectButton = props => {
	if (props.buttonStyle) {
		return <ButtonStyleConnectButton {...props} />
	}
	return <BoxStyleConnectButton {...props} />
};


WalletConnectButton.defaultProps = {
	buttonStyle: false,
};

WalletConnectButton.propTypes = {
	buttonStyle: PropTypes.bool,
};

export default WalletConnectButton;
