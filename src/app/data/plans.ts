import { Plan } from '../models/plan';

export const PLANS: Plan[] = [
    {
        id: 'tipstricks',
        image: '~/app/assets/images/tipstricks.png',
        title: 'Tips & Tricks',
        desc: 'Unlock all Tips & Tricks',
        priceFallback: '1.00',
        priceShort: '',
        amount: 0,
        tipstrick: true,
    },
    {
        id: 'small',
        image: '~/app/assets/images/1.png',
        title: 'Professional',
        desc: 'Unlock 5 photo uploads',
        priceFallback: '1.50',
        priceShort: '',
        amount: 5,
        tipstrick: false,
    },
    {
        id: 'medium',
        image: '~/app/assets/images/2.png',
        title: 'Business',
        desc: 'Unlock 15 photo uploads',
        priceFallback: '2.50',
        priceShort: '',
        amount: 15,
        tipstrick: false,
    },
    {
        id: 'large',
        image: '~/app/assets/images/3.png',
        title: 'Enterprise',
        desc: 'Unlock 30 photo uploads',
        priceFallback: '4.50',
        priceShort: '',
        amount: 30,
        tipstrick: true,
    }
];