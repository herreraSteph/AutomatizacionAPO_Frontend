// material-ui
import TextField from '@mui/material/TextField'; // Importa el componente TextField
import Grid from '@mui/material/Grid'; // Importa el componente Grid
import Button from '@mui/material/Button'; // Importa el componente Button
import MenuItem from '@mui/material/MenuItem'; // Importa el componente MenuItem
// project imports
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

const CrearNumero = () => (
  <MainCard title="Creacion de Numero">
    <Grid container spacing={4} justifyContent="center" alignItems="center">
      <Grid item xs={12} sm={5}>
        <TextField fullWidth label="Nom.Act.O pry" variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} value={"SM25-001"}/>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField fullWidth label="Fecha de creacion" type="date" variant="outlined" InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} />
      </Grid>
      <Grid item xs={12} sm={5}>
        <TextField fullWidth label="Cliente" variant="outlined" select>
          <MenuItem value="option1">Option 1</MenuItem>
          <MenuItem value="option2">Option 2</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField fullWidth label="Fecha de inicio" type="date" variant="outlined" InputLabelProps={{ shrink: true }} />
      </Grid>
      <Grid item xs={12} sm={5}>
        <TextField fullWidth label="Representante" variant="outlined" select>
          <MenuItem value="option1">Option 1</MenuItem>
          <MenuItem value="option2">Option 2</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField fullWidth label="Prioridad" variant="outlined" select>
          <MenuItem value="option1">Option 1</MenuItem>
          <MenuItem value="option2">Option 2</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Area" variant="outlined" select>
          <MenuItem value="option1">Option 1</MenuItem>
          <MenuItem value="option2">Option 2</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Button fullWidth variant="contained" color="primary">Submit</Button>
      </Grid>
    </Grid>
  </MainCard>
);
export default CrearNumero;