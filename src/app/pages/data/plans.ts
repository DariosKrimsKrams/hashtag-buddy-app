import { Plan } from '../../models/plan';

export const PLAN: Plan[] = [
    {
        id: 0,
        image: "~/app/assets/images/5.png",
        title: "Entry Magic",
        content: "- unlock 5 photo uploads\n- 0,30 € per upload",
        plan: "once",
        cost: "1,50 €",
        isHighlight: true,
        isAbo: false,
        savings: 0
    },
    {
        id: 1,
        image: "~/app/assets/images/10.png",
        title: "Advanced Magic",
        content: "- unlock 10 photo uploads\n- 0,25 € per upload",
        plan: "once",
        cost: "2,50 €",
        isHighlight: false,
        isAbo: false,
        savings: 17
    },
    {
        id: 2,
        image: "~/app/assets/images/20.png",
        title: "Professional Magic",
        content: "- unlock 20 photo uploads\n- 0,20 € per upload",
        plan: "once",
        cost: "4,00 €",
        isHighlight: true,
        isAbo: false,
        savings: 33
    },
    {
        id: 3,
        image: "~/app/assets/images/inf.png",
        title: "Unlimited Magic",
        content: "- Subscription period: 1 month\n- Unlimited photo uploads\n",
        plan: "abo",
        cost: "12,50 €",
        isHighlight: false,
        isAbo: true,
        savings: 0
    },
    {
        id: 4,
        image: "~/app/assets/images/inf.png",
        title: "Unlimited Magic",
        content: "- Subscription period: 3 months\n- Unlimited photo uploads\n",
        plan: "abo",
        cost: "7,50 €",
        isHighlight: false,
        isAbo: true,
        savings: 48
    },
];