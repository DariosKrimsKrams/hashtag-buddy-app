import { Plan } from '../models/plan';

export const PLANS: Plan[] = [
    {
        id: 'small',
        title: 'iap_small_title',
        desc: 'iap_photos_desc',
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
        title: 'iap_medium_title',
        desc: 'iap_photos_desc',
        desc2: 'iap_search_desc',
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
        title: 'iap_large_title',
        desc: 'iap_photos_desc',
        desc2: 'iap_tipstricks_desc',
        desc3: 'iap_search_desc',
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
        title: 'iap_tipstricks_title',
        desc: 'iap_tipstricks_desc2',
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
        desc: 'iap_search_desc2',
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