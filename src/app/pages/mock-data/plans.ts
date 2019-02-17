import { Plan } from '../../models/plan';

export const PLAN: Plan[] = [
    {
        id: 0,
        image: "~/app/assets/images/1.png",
        title: "Welcome offer",
        content: "- 15 cent / photo\n- 20 unlocked photos\n- Unlimited History",
        plan: "once",
        cost: "3,00 €",
        isHighlight: true
    },
    {
        id: 2,
        image: "~/app/assets/images/3.png",
        title: "Beginner's Magic",
        content: "- 20 cent / photo\n- 10 unlocked photos\n- Unlimited History",
        plan: "once",
        cost: "2,00 €",
        isHighlight: false
    },
    {
        id: 3,
        image: "~/app/assets/images/3.png",
        title: "Unlimited Magic",
        content: "- Subscription period 1 month\n- Unlimited photos\n- Unlimited History\n",
        plan: "per month",
        cost: "9,50 €",
        isHighlight: false
    },
    {
        id: 4,
        image: "~/app/assets/images/3.png",
        title: "Unlimited Magic",
        content: "- Subscription period 3 months\n- Unlimited photos\n- Unlimited History\n",
        plan: "per month",
        cost: "7,00 €",
        isHighlight: false
    },
];