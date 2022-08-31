import { makeStyles } from '@material-ui/core';

export default makeStyles(theme => {
    return {
        root: {
            width: 14,
            height: 14,
            color: theme?.palette?.red[300] ?? 'red',
            border:`1px solid ${theme?.palette?.red[400] ?? 'red'}`,
            borderRadius: '100%',
            [theme.breakpoints.down('sm')]: {
                marginRight: -14,
            },
        },
    };
});
