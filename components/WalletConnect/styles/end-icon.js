import { makeStyles } from '@material-ui/core';

export default makeStyles(theme => {
    return {
        root: {
            width: '1.25em',
            height: '1.25em',
            marginLeft: -8,
            marginRight: -4,
            [theme.breakpoints.down('sm')]: {
                marginLeft: -22,
                marginRight: -2,
            },
        },
    };
});
