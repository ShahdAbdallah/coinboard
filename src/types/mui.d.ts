import '@mui/material/Chip';

declare module '@mui/material/Chip' {
  interface ChipPropsVariantOverrides {
    priceUp: true;
    priceDown: true;
  }
}