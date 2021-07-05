import React from 'react';
import PropTypes from 'prop-types';
// import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
	/* Styles applied to the root element. */
	root: {
		color: theme.palette.text.primary,
	},
	/* Styles applied if `rounded={true}`. */
	rounded: ({ rounded }) =>
		rounded && {
			borderRadius: theme.shape.borderRadius,
		},
	/* Styles applied if `variant="outlined"`. */
	outlined: ({ variant }) =>
		variant === 'outlined' && {
			border: `1px solid ${theme.palette.divider}`,
		},
}));

const Example = React.forwardRef((props, ref) => {
	const {
		className,
		component: Component = 'div',
		children,
		rounded,
		variant,
		...other
	} = props;
	const classes = useStyles({ rounded, variant });

	return (
		<Component
			className={
				/* clsx(Object.values(classes), className) */ `${Object.values(
					classes,
				)} ${className}`
			}
			ref={ref}
			{...other}
		>
			{children}
		</Component>
	);
});

Example.defaultProps = {
	className: null,
	component: 'div',
	children: null,
	rounded: false,
	variant: 'default',
};

Example.propTypes = {
	className: PropTypes.string,
	component: PropTypes.elementType,
	children: PropTypes.node,
	rounded: PropTypes.bool,
	variant: PropTypes.oneOf(['default', 'outlined']),
};

export default Example;
