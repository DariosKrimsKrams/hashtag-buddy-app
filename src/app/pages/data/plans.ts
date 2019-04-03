import { Plan } from '../../models/plan';

export const PLAN: Plan[] = [
    {
        id: 0,
        image: "~/app/assets/images/1.png",
        title: "Standard Offer",
        content: "- 5 unlocked photos\n- 0,30 € per photo",
        plan: "once",
        cost: "1,50 €",
        isHighlight: true,
        isAbo: false,
        savings: 0
    },
    {
        id: 1,
        image: "~/app/assets/images/3.png",
        title: "Beginner's Magic",
        content: "- 10 unlocked photos\n- 0,25 € per photo",
        plan: "once",
        cost: "2,50 €",
        isHighlight: false,
        isAbo: false,
        savings: 17
    },
    {
        id: 2,
        image: "~/app/assets/images/1.png",
        title: "Welcome Offer",
        content: "- 20 unlocked photos\n- 0,20 € per photo",
        plan: "once",
        cost: "4,00 €",
        isHighlight: true,
        isAbo: false,
        savings: 33
    },
    {
        id: 3,
        image: "~/app/assets/images/3.png",
        title: "Unlimited Magic",
        content: "- Subscription period: 1 month\n- Unlimited photos\n",
        plan: "abo",
        cost: "12,50 €",
        isHighlight: false,
        isAbo: true,
        savings: 0
    },
    {
        id: 4,
        image: "~/app/assets/images/3.png",
        title: "Unlimited Magic",
        content: "- Subscription period: 3 months\n- Unlimited photos\n",
        plan: "abo",
        cost: "6,50 €",
        isHighlight: false,
        isAbo: true,
        savings: 48
    },
];