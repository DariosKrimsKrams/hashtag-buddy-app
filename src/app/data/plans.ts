import { Plan } from '../models/plan';

export const PLANS: Plan[] = [
    {
        id: 'small',
        title: 'Professional',
        desc: '+ Unlock hashtags of 5 photo uploads',
        desc2: '',
        desc3: '',
        priceFallback: '2.29',
        priceShort: '',
        amount: 5,
        tipstrick: false,
        hashtagInspector: false,
        category: 0,
        consumable: true
    },
    {
        id: 'medium',
        title: 'Business',
        desc: '+ Unlock hashtags of 15 photo uploads',
        desc2: '+ Hashtag Inspector Unlimited',
        desc3: '',
        priceFallback: '3.49',
        priceShort: '',
        amount: 15,
        tipstrick: false,
        hashtagInspector: true,
        category: 0,
        consumable: true
    },
    {
        id: 'large',
        title: 'Enterprise',
        desc: '+ Unlock hashtags of 30 photo uploads',
        desc2: '+ Tips & Tricks',
        desc3: '+ Hashtag Inspector Unlimited',
        priceFallback: '5.49',
        priceShort: '',
        amount: 30,
        tipstrick: true,
        hashtagInspector: true,
        category: 0,
        consumable: true
    },
    {
        id: 'tipstricks',
        title: 'Tips & Tricks',
        desc: '+ Read all Tips & Tricks',
        desc2: '',
        desc3: '',
        priceFallback: '1.09',
        priceShort: '',
        amount: 0,
        tipstrick: true,
        hashtagInspector: false,
        category: 1,
        consumable: false
    },
    {
        id: 'hashtagsunlimited',
        title: 'Hashtag Inspector Unlimited',
        desc: '+ Unlock all Hashtag Inspector hashtags',
        desc2: '',
        desc3: '',
        priceFallback: '1.09',
        priceShort: '',
        amount: 0,
        tipstrick: false,
        hashtagInspector: true,
        category: 1,
        consumable: false
    }
];