export const fontFamily = {
  primary: '"Lato", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
};

export const fontSize = {
  xs: "12px",
  sm: "14px",
  md: "16px",
  lg: "20px",
  xl: "24px",
  "2xl": "32px",
};

export const fontWeight = {
  regular: 400,
  semibold: 600,
  bold: 700,
};

export const lineHeight = {
  // Headers: font size * 1.2
  header: 1.2,
  // Paragraphs: font size * 1.4
  paragraph: 1.4,
};

export const textStyles = {
  brand: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.header,
  },
  title: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.header,
  },
  sectionTitle: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.header,
  },
  body: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.paragraph,
  },
  bodySm: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.paragraph,
  },
  caption: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.paragraph,
  },
  button: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    lineHeight: 1,
  },
};
