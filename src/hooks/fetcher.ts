import axios from 'axios';
import { mincu } from 'mincu-vanilla';

export const fetcher = axios.create();
mincu.useAxiosInterceptors(fetcher);

export const baseURL = 'https://ncumap-be.ncuos.com';

export default fetcher;
