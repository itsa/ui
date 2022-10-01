import { makeStyles } from '@material-ui/core';

export default makeStyles(theme => {
    return {
        root: {
            color: theme?.palette?.red[300] ?? 'red',
        },
    };
});
