export type TypographySample = {
  label: string;
  className: string;
  size: string;
  lineHeight: string;
  font: "display" | "body";
};

export const fontFamilies = {
  display: "MoreYears",
  body: "Poppins",
};

export const typographySamples: TypographySample[] = [
  {
    label: "Display 1",
    className: "text-[64px] leading-[72px]",
    size: "64px",
    lineHeight: "72px",
    font: "display",
  },
  {
    label: "Display 2",
    className: "text-[48px] leading-[56px]",
    size: "48px",
    lineHeight: "56px",
    font: "display",
  },
  {
    label: "Heading 1",
    className: "text-[40px] leading-[48px]",
    size: "40px",
    lineHeight: "48px",
    font: "display",
  },
  {
    label: "Heading 2",
    className: "text-[32px] leading-[40px]",
    size: "32px",
    lineHeight: "40px",
    font: "display",
  },
  {
    label: "Heading 3",
    className: "text-[24px] leading-[32px]",
    size: "24px",
    lineHeight: "32px",
    font: "display",
  },
  {
    label: "Body Large",
    className: "text-[18px] leading-[28px]",
    size: "18px",
    lineHeight: "28px",
    font: "body",
  },
  {
    label: "Body",
    className: "text-[16px] leading-[24px]",
    size: "16px",
    lineHeight: "24px",
    font: "body",
  },
  {
    label: "Small",
    className: "text-[14px] leading-[20px]",
    size: "14px",
    lineHeight: "20px",
    font: "body",
  },
  {
    label: "Caption",
    className: "text-[12px] leading-[16px] uppercase tracking-[0.08em]",
    size: "12px",
    lineHeight: "16px",
    font: "body",
  },
];
