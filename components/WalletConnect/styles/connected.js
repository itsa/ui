import { makeStyles, alpha } from '@material-ui/core';

export default makeStyles(theme => {
	return {
		root: {
			textTransform: 'none',
			position: 'relative',
		},
		dropdown: {
			position: 'fixed',
			display: 'flex',
			top:0,
			left:0,
			width:'100%',
			height:'100%',
			alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'column',
			zIndex: 1,
		},
		iconButton: {
			position: 'absolute',
			top: theme.spacing(1),
			right: theme.spacing(1),
		},
		backdrop: {
			backgroundColor: `${alpha(theme.palette.common.black, 0.5)}!important`,
			zIndex: 1
		},
		buttonStyleBtn: {
			position: 'relative',
		},
	};
});
