// Format number to XAF
export const formatNumberToXAF = (number: number) => {
  return number.toLocaleString('fr-FR', { style: 'currency', currency: 'XAF' });
};