import { Icons } from "@/components/icons"
import { type MainNavItem } from "@/types"

export const siteConfig = {
  name: "District",
  url: "https://districtlabs.com",
  description:
    "Transform your ideas into action with a no-code strategy builder.",
  links: {
    twitter: "https://twitter.com/district_labs",
  },
  marketingNav: [
    {
      title: "Platform",
      items: [
        {
          title: "Invest",
          href: "/invest",
          description:
            "Find strategies you can invest in right away built by the pros.",
          items: [],
        },
        {
          title: "Create",
          href: "/create",
          description:
            "Build algorithmic strategies, backtest them, then execute - all in one platform.",
          items: [],
        },
        {
          title: "About",
          href: "/about",
          description:
            " Discover how we&apos;re giving investors the best chance for success.",
          items: [],
        },
      ],
    },
  ] satisfies MainNavItem[],
  onboardingSteps: [
    {
      id: 1,
      name: "Identity",
      description:
        "Lorem ipsum dolor sit amet consectetur adipscing elit amet lorem upsum. Dolor sit consec tetur adip nunc sed.",
      href: "/onboarding",
    },
    {
      id: 2,
      name: "Funding",
      description:
        "Lorem ipsum dolor sit amet consectetur adipscing elit amet lorem upsum. Dolor sit consec tetur adip nunc sed.",
      href: "/onboarding/funding",
    },
    {
      id: 3,
      name: "Strategy",
      description:
        "Lorem ipsum dolor sit amet consectetur adipscing elit amet lorem upsum. Dolor sit consec tetur adip nunc sed.",
      href: "/onboarding/strategy",
    },
  ],
  onboardingStepsMini: [
    {
      name: "Verify your identity",
      icon: Icons.user,
    },
    {
      name: "Fund your account",
      icon: Icons.bank,
    },
    {
      name: "Set up your first strategy",
      icon: Icons.rocket,
    },
  ],
}
