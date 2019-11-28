import { Plan } from '../models/plan';

export const PLAN: Plan[] = [
    {
        id: 'tipstricks',
        image: '~/app/assets/images/tipstricks.png',
        title: 'Tips & Tricks',
        desc: 'Unlock all Tips & Tricks',
        type: 'inapp',
        priceFallback: '1.00',
        amount: 0,
        tipstrick: true,
    },
    {
        id: 'small',
        image: '~/app/assets/images/1.png',
        title: 'Professional',
        desc: 'Unlock 5 photo uploads',
        type: 'inapp',
        priceFallback: '1.50',
        amount: 5,
        tipstrick: false,
    },
    {
        id: 'medium',
        image: '~/app/assets/images/2.png',
        title: 'Business',
        desc: 'Unlock 15 photo uploads',
        type: 'inapp',
        priceFallback: '2.50',
        amount: 15,
        tipstrick: false,
    },
    {
        id: 'large',
        image: '~/app/assets/images/3.png',
        title: 'Enterprise',
        desc: 'Unlock 30 photo uploads',
        type: 'inapp',
        priceFallback: '4.50',
        amount: 30,
        tipstrick: true,
    }
];