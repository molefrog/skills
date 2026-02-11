import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Svg,
  Path,
  Circle,
  renderToFile,
} from "@react-pdf/renderer";

// --- Custom Fonts (Inter from Google Fonts, downloaded locally) ---

Font.register({
  family: "Inter",
  fonts: [
    { src: "./fonts/Inter-Regular.ttf", fontWeight: "normal" },
    { src: "./fonts/Inter-Medium.ttf", fontWeight: "medium" },
    { src: "./fonts/Inter-SemiBold.ttf", fontWeight: "semibold" },
    { src: "./fonts/Inter-Bold.ttf", fontWeight: "bold" },
    { src: "./fonts/Inter-Italic.ttf", fontWeight: "normal", fontStyle: "italic" },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

// --- Lucide Icons (converted from lucide-static SVGs) ---

interface IconProps {
  size?: number;
  color?: string;
}

const FileTextIcon = ({ size = 16, color = "#333" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
      stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round"
    />
    <Path d="M14 2v5a1 1 0 0 0 1 1h5" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />
    <Path d="M10 9H8" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />
    <Path d="M16 13H8" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />
    <Path d="M16 17H8" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />
  </Svg>
);

const ZapIcon = ({ size = 16, color = "#333" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
      stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

const CheckCircleIcon = ({ size = 16, color = "#333" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M21.801 10A10 10 0 1 1 17 3.335" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="m9 11 3 3L22 4" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LightbulbIcon = ({ size = 16, color = "#333" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"
      stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round"
    />
    <Path d="M9 18h6" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />
    <Path d="M10 22h4" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />
  </Svg>
);

const StarIcon = ({ size = 16, color = "#333" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
      stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

// --- Styles ---

const colors = {
  primary: "#4f46e5",
  primaryLight: "#eef2ff",
  dark: "#1e293b",
  gray: "#64748b",
  lightGray: "#f1f5f9",
  white: "#ffffff",
  green: "#10b981",
  greenLight: "#ecfdf5",
  amber: "#f59e0b",
  amberLight: "#fffbeb",
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: colors.white,
    padding: 50,
    fontFamily: "Inter",
    fontSize: 11,
    color: colors.dark,
  },
  // Header
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 30,
    gap: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#c7d2fe",
    marginTop: 2,
  },
  // Sections
  section: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.lightGray,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "semibold",
    color: colors.primary,
  },
  text: {
    fontSize: 11,
    lineHeight: 1.7,
    color: colors.dark,
  },
  textItalic: {
    fontSize: 11,
    lineHeight: 1.7,
    color: colors.gray,
    fontStyle: "italic",
  },
  // Feature list
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  // Highlight box
  highlightBox: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.amberLight,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: colors.amber,
  },
  highlightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  highlightTitle: {
    fontSize: 13,
    fontWeight: "semibold",
    color: "#92400e",
  },
  highlightText: {
    fontSize: 11,
    lineHeight: 1.7,
    color: "#78350f",
  },
  // Stars row
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: 20,
    marginBottom: 10,
  },
  starsLabel: {
    fontSize: 12,
    fontWeight: "medium",
    color: colors.gray,
    textAlign: "center",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 35,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    color: colors.gray,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 8,
  },
});

// --- Document ---

const SimpleDocument = () => (
  <Document title="Simple Document" author="Claude">
    <Page size="A4" style={styles.page}>
      {/* Header with icon */}
      <View style={styles.headerBar}>
        <FileTextIcon size={28} color={colors.white} />
        <View>
          <Text style={styles.headerTitle}>Hello, React-PDF!</Text>
          <Text style={styles.headerSubtitle}>
            Custom fonts & icons powered by Inter + Lucide
          </Text>
        </View>
      </View>

      {/* About section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ZapIcon size={16} color={colors.primary} />
          <Text style={styles.sectionTitle}>About This Document</Text>
        </View>
        <Text style={styles.text}>
          This PDF was generated programmatically using React-PDF with the Inter
          font family from Google Fonts and Lucide icons converted to SVG
          components. Everything is rendered natively in the PDF — no rasterized
          images needed.
        </Text>
      </View>

      {/* Features section with check icons */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <CheckCircleIcon size={16} color={colors.primary} />
          <Text style={styles.sectionTitle}>Features Demonstrated</Text>
        </View>
        <View style={styles.featureItem}>
          <CheckCircleIcon size={12} color={colors.green} />
          <Text style={styles.text}>Custom Inter font with multiple weights (regular, medium, semibold, bold)</Text>
        </View>
        <View style={styles.featureItem}>
          <CheckCircleIcon size={12} color={colors.green} />
          <Text style={styles.text}>Italic font style support</Text>
        </View>
        <View style={styles.featureItem}>
          <CheckCircleIcon size={12} color={colors.green} />
          <Text style={styles.text}>Lucide SVG icons rendered as native PDF vector graphics</Text>
        </View>
        <View style={styles.featureItem}>
          <CheckCircleIcon size={12} color={colors.green} />
          <Text style={styles.text}>Colored accent borders and styled sections</Text>
        </View>
        <View style={styles.featureItem}>
          <CheckCircleIcon size={12} color={colors.green} />
          <Text style={styles.text}>Rounded corners and background fills</Text>
        </View>
      </View>

      {/* Tip box */}
      <View style={styles.highlightBox}>
        <View style={styles.highlightHeader}>
          <LightbulbIcon size={16} color={colors.amber} />
          <Text style={styles.highlightTitle}>Pro Tip</Text>
        </View>
        <Text style={styles.highlightText}>
          Fonts must be downloaded as local files before registering — remote
          URLs don't work with @react-pdf/renderer. Use the google-fonts.txt
          reference to find TrueType URLs, download with curl, then register
          with Font.register().
        </Text>
      </View>

      {/* Font showcase */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <StarIcon size={16} color={colors.primary} />
          <Text style={styles.sectionTitle}>Font Showcase</Text>
        </View>
        <Text style={[styles.text, { fontWeight: "normal" }]}>
          This line uses Inter Regular (400).
        </Text>
        <Text style={[styles.text, { fontWeight: "medium" }]}>
          This line uses Inter Medium (500).
        </Text>
        <Text style={[styles.text, { fontWeight: "semibold" }]}>
          This line uses Inter SemiBold (600).
        </Text>
        <Text style={[styles.text, { fontWeight: "bold" }]}>
          This line uses Inter Bold (700).
        </Text>
        <Text style={styles.textItalic}>
          And this line uses Inter Italic — great for emphasis.
        </Text>
      </View>

      {/* Star rating */}
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon key={i} size={18} color={colors.amber} />
        ))}
      </View>
      <Text style={styles.starsLabel}>Built with React-PDF</Text>

      {/* Footer */}
      <View style={styles.footer} fixed>
        <Text>Font: Inter by Google Fonts</Text>
        <Text>Icons: Lucide (lucide.dev)</Text>
        <Text
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </View>
    </Page>
  </Document>
);

(async () => {
  const outputPath = "./simple-doc.pdf";
  console.log("Generating PDF...");
  await renderToFile(<SimpleDocument />, outputPath);
  console.log(`PDF saved to ${outputPath}`);
})();
