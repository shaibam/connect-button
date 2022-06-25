import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import _ from 'lodash';
import { Typography } from '@mui/material';

export default function NativeSelectDemo({ available = 0, onChange = () => { } }) {

  const handleChange = (event)=>{
    onChange(event.target.value);
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      {available ?
        <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Mint amount
          </InputLabel>
          <NativeSelect
            defaultValue={1}
            inputProps={{
              name: 'mint',
              id: 'uncontrolled-native',
            }}
            onChange={handleChange}
          >
            {_.map([...Array(available).keys()], (v) => {
              return <option key={'option' + v} value={v}>{v}</option>
            })}
          </NativeSelect>
        </FormControl>
        :
        <Typography>0 available mints</Typography>}
    </Box>
  );
}
