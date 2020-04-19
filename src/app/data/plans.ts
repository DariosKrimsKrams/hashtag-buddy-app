import { Plan } from '../models/plan';

export const PLANS: Plan[] = [
    {
        id: 'tipstricks',
        title: 'Tips & Tricks',
        desc: 'Unlock all Tips & Tricks',
        priceFallback: '1.00',
        priceShort: '',
        amount: 0,
        tipstrick: true,
    },
    {
        id: 'small',
        title: 'Professional',
        desc: 'Unlock 5 photo uploads',
        priceFallback: '1.50',
        priceShort: '',
        amount: 5,
        tipstrick: false,
    },
    {
        id: 'medium',
        title: 'Business',
        desc: 'Unlock 15 photo uploads',
        priceFallback: '2.50',
        priceShort: '',
        amount: 15,
        tipstrick: false,
    },
    {
        id: 'large',
        title: 'Enterprise',
        desc: 'Unlock 30 photo uploads',
        priceFallback: '4.50',
        priceShort: '',
        amount: 30,
        tipstrick: true,
    }
];