# Years Brand Colour System

This file documents the full Years Brand colour palette and accessibility guidance. All colours are specified in web-safe hex format. We also include WCAG AA / AAA contrast requirements and recommended 600-degree separation colour pairings (for example, shade 200 paired with shade 800) for accessible combinations.

## Naming Conventions

To keep colour names consistent across codebases, design systems, and tooling, each colour follows this pattern: colour-family followed by a hyphen then the shade number. Colour families include: purple, green, yellow, blue, pink, gray. Shades range from 50 (lightest) up to 950 (darkest). Always use lowercase and hyphens; do not use spaces or underscores. Aim for combinations that are 600 degrees apart in the scale such as purple-200 paired with purple-800 for good contrast.

## Purple

| Name | Hex |
|------|-----|
| purple-50  | #F6F3FC |
| purple-100 | #ECE7F8 |
| purple-200 | #DED4F3 |
| purple-300 | #D1C2F4 |
| purple-400 | #BAAEEC |
| purple-500 | #AE97E8 |
| purple-600 | #896FCA |
| purple-700 | #7257B7 |
| purple-800 | #5B3FA3 |
| purple-900 | #483087 |
| purple-950 | #382569 |

Recommended combinations with 600-degree separation include purple-200 paired with purple-800, purple-100 paired with purple-700, and purple-300 paired with purple-900.

## Green

| Name | Hex |
|------|-----|
| green-50  | #F4FBF9 |
| green-100 | #D6EEE9 |
| green-200 | #C2E5DE |
| green-300 | #A1D4C9 |
| green-400 | #7FC3B5 |
| green-500 | #5EB1A0 |
| green-600 | #44A87D |
| green-700 | #2B7868 |
| green-800 | #126254 |
| green-900 | #043A3E |
| green-950 | #023129 |

Recommended combinations with 600-degree separation include green-200 paired with green-800, green-100 paired with green-700, and green-300 paired with green-900.

## Yellow

| Name | Hex |
|------|-----|
| yellow-50  | #FFFBF1 |
| yellow-100 | #FFF6E5 |
| yellow-200 | #FFEDC2 |
| yellow-300 | #FFE2A1 |
| yellow-400 | #FFD989 |
| yellow-500 | #FFD47A |
| yellow-600 | #F5C055 |
| yellow-700 | #E9A944 |
| yellow-800 | #CF8920 |
| yellow-900 | #A36200 |
| yellow-950 | #5C3700 |

Recommended combinations with 600-degree separation include yellow-200 paired with yellow-800, yellow-100 paired with yellow-700, and yellow-300 paired with yellow-900.

## Blue

| Name | Hex |
|------|-----|
| blue-50  | #F2FAFD |
| blue-100 | #D8F0F9 |
| blue-200 | #B9E2F2 |
| blue-300 | #8FCDEF |
| blue-400 | #6286D8 |
| blue-500 | #3C9CC1 |
| blue-600 | #3078A3 |
| blue-700 | #255D80 |
| blue-800 | #1B4561 |
| blue-900 | #143349 |
| blue-950 | #0F2838 |

Recommended combinations with 600-degree separation include blue-200 paired with blue-800, blue-100 paired with blue-700, and blue-300 paired with blue-900.

## Pink

| Name | Hex |
|------|-----|
| pink-50  | #FFF6F9 |
| pink-100 | #FDE9F1 |
| pink-200 | #F8C7D6 |
| pink-300 | #F2A5BB |
| pink-400 | #EC829F |
| pink-500 | #E85E7F |
| pink-600 | #CC4767 |
| pink-700 | #AD3150 |
| pink-800 | #8F1C39 |
| pink-900 | #6E0722 |
| pink-950 | #4D0518 |

Recommended combinations with 600-degree separation include pink-200 paired with pink-800, pink-100 paired with pink-700, and pink-300 paired with pink-900.

## Gray

| Name | Hex |
|------|-----|
| gray-50  | #FFFFFF |
| gray-100 | #F7F7F7 |
| gray-200 | #E8E8E8 |
| gray-300 | #D1D1D1 |
| gray-400 | #B7B7B7 |
| gray-500 | #999999 |
| gray-600 | #777777 |
| gray-700 | #595959 |
| gray-800 | #424242 |
| gray-900 | #303030 |
| gray-950 | #262626 |

Recommended combinations with 600-degree separation include gray-200 paired with gray-800, gray-100 paired with gray-700, and gray-300 paired with gray-900.

## WCAG Contrast Guidance

Contrast ratio measures the difference in perceived brightness between two colours. The ratio ranges from 1:1 (no contrast) to 21:1 (maximum contrast). The Web Content Accessibility Guidelines define minimum contrast ratios for accessible text and UI.

For WCAG Level AA, normal text should have at least 4.5:1 contrast, while large text and UI components should have at least 3:1 contrast. For WCAG Level AAA, normal text should have at least 7:1 contrast, and large text should have at least 4.5:1 contrast. Using AAA standards improves readability for users with low vision or challenging viewing conditions.

## Recommended Practice

When pairing colours, always check foreground versus background contrast using the ratios above. Prefer combinations with 600-degree separation for greater contrast. For body text, aim for AA or AAA compliance depending on audience and legal requirements. For UI icons and interface components, aim for at least 3:1 contrast.

## Notes and Tips

Colours used only for decoration, such as background stripes or purely visual elements, do not require contrast compliance. However, avoid misleading low-contrast UI elements. Logos and brand names are typically exempt from strict contrast ratios, but good contrast is still recommended. Tools like WebAIM Contrast Checker make testing easy.

## References

WCAG 2.1 Contrast (Minimum) and Enhanced standards — W3C/WAI. WebAIM Contrast Checker requirements and ratios. MDN colour contrast overview and thresholds.

End of Years Brand Colour Guidelines
