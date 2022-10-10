import { makeStyles } from '@material-ui/core';

export default makeStyles(theme => {
	return {
		root: {
			color: theme?.palette?.green[300] ?? 'green',
			marginRight: 4,
		},
	};
});
