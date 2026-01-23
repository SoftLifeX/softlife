export interface Review {
  id: number;
  name: string;
  role: string;
  company: string;
  text: string;
}

export const reviewItems: Review[] = [
  {
    id: 1,
    name: "Magus Omoriye",
    role: "Product Designer",
    company: "club7",
    text: "Daniel nailed our CNC interface redesign in two weeks. He simplified our 12-step workflow down to 4 clicks and caught a critical nav bug our team missed for months.",
  },
  {
    id: 2,
    name: "Mary Chinonso",
    role: "Creative Director",
    company: "Studio Kairos",
    text: "Brought Daniel in for a rebrand sprint. He delivered 3 solid concepts in 48 hours and iterated based on feedback without ego. The final lockup increased our pitch-to-close rate by 40%.",
  },
  {
    id: 3,
    name: "Smart Onyeka",
    role: "Co-founder",
    company: "Form & Foundry",
    text: "Daniel rebuilt our checkout flow and reduced cart abandonment by 23%. He also suggested A/B testing the CTA color—something our team never thought to do. Quick turnaround, zero drama.",
  },
  {
    id: 4,
    name: "Benita C.D.",
    role: "Frontend Developer",
    company: "Swan Signature",
    text: "Best design handoff I've ever worked with. Daniel's Figma files were production-ready with proper naming, variants, and component documentation. Saved me at least 10 hours of back-and-forth.",
  },
  {
    id: 5,
    name: "Kizito Campbell",
    role: "CEO",
    company: "Bellzito",
    text: "Daniel redesigned our landing page and conversion jumped 31% in the first week. He also delivered two days early and stayed on a call to help our dev implement the animations correctly.",
  },
];
