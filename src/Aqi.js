import React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const columns = [
    { field: 'id', headerName: 'ID', width: 170 },
    { field: 'name', headerName: 'City', width: 230 },
    {
        field: 'aqi',
        headerName: 'AQI Score',
        width: 230,
        renderCell: (params) => ( <
            strong style = {
                { color: params.value < 50 ? 'green' : params.value > 50 && params.value < 100 ? 'greenyellow' : params.value > 100 && params.value < 200 ? 'yellow' : params.value > 200 && params.value < 300 ? 'orange' : params.value > 300 && params.value < 400 ? 'hotpink' : 'red' }
            } > { params.value } < /
            strong >
        ),


    },
    { field: 'time', headerName: 'Updated On', width: 230 }
];

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,

    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',

        color: theme.palette.text.secondary,
    },
}));

export default function Aqi() {
    const [isPaused, setPause] = React.useState(false);
    const [aqi, setAqi] = React.useState([]);
    const ws = React.useRef(null);
    const classes = useStyles();

    React.useEffect(() => {
        ws.current = new WebSocket("ws://city-ws.herokuapp.com/");
        ws.current.onopen = () => console.log("ws opened");
        ws.current.onclose = () => console.log("ws closed");

        return () => {
            ws.current.close();
        };
    }, []);

    var City = function(id, name, aqi) {
        this.id = id
        this.name = name
        this.aqi = aqi
        this.time = new Date()
    }

    React.useEffect(() => {

        if (!ws.current) return;

        ws.current.onmessage = e => {
            if (isPaused) return;
            let cityArr = []
            const message = JSON.parse(e.data);

            for (let i = 0; i < message.length; i++) {
                const element = message[i];

                const newCity = new City(i + 1, element.city, (element.aqi).toFixed(2))

                cityArr.push(newCity)

            }

            setAqi(cityArr)

        };


    }, [isPaused]);


    return (

        <div className = { classes.root } >
        <Grid container spacing = { 3 } >
        <Grid item xs = { 3 } > < /Grid >
        <Grid item xs = { 6 } >
        <h3 > AQI Score by City < /h3> < /Grid >
        </Grid>
        <Grid container spacing = { 3 } >
        <Grid item xs = { 2 } >
        </Grid >
        <Grid item xs = { 8 } >
        <Paper className = { classes.paper } >
        <div style = {
            { height: 750, width: '100%' }
        } >
        <DataGrid rows = { aqi }
        columns = { columns }
        pageSize = { 12 }
        /> </div >

        </Paper>
        </Grid >
        <Grid item xs = { 2 } >
        </Grid>
        </Grid >
        </div>

    );
}