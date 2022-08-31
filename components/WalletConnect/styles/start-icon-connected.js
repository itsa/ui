import { makeStyles } from '@material-ui/core';

export default makeStyles(theme => {
	return {
		root: {
			width: 14,
			height: 14,
			color: theme?.palette?.green[300] ?? 'green',
			border:`1px solid ${theme?.palette?.green[400] ?? 'green'}`,
			borderRadius: '100%',
            [theme.breakpoints.down('sm')]: {
                marginRight: -14,
            },
		},
	};
});
