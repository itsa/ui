import { makeStyles, alpha } from '@material-ui/core';

export default makeStyles(theme => {
    return {
        root: {},
        listIcons: {
            zIndex: 2,
            width: '100%',
            maxWidth: 400,
            marginTop: '2rem',
            '& $listItem + $listItem':{
                marginTop: theme.spacing(1),
            },
        },
        listItem: {
            border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
            borderRadius: 6,
        },
        ledgerIcon: {
            width: '4rem',
            height: '4rem',
            verticalAlign: 'middle',
            width: '6rem',
            fill: theme?.palette?.default?.contrastText,
            padding: '0.5rem'
        },
        iconText: {
            '& span': {
                fontSize: '1.5rem'
            }
        }
    };
});
