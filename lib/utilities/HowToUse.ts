interface HowToUseShape {
  id: number;
  heading: string;
  content: string;
  image: string;
}
export const HowToUseData: HowToUseShape[] = [
  {
    id: 1,
    heading: "Search",
    content:
      "Browse Qwik Savings to find all hand-tested, verified coupon codes, deals and offers.",
    image: "/HowToUse/Search.png",
  },
  {
    id: 2,
    heading: "Shop",
    content: "Go to the brands website and start filling your shopping carts.",
    image: "/HowToUse/Shop.png",
  },
  {
    id: 3,
    heading: "Save",
    content: "Apply your code at checkout and save your money.",
    image: "/HowToUse/Save.png",
  },
];
