import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Link,
} from '@react-pdf/renderer';
import { renderToFile } from '@react-pdf/renderer';

// Define reusable styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
  },
  logo: {
    width: 80,
    height: 80,
  },
  companyInfo: {
    textAlign: 'right',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  text: {
    marginBottom: 8,
    lineHeight: 1.5,
  },
  table: {
    marginTop: 10,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3498db',
    padding: 8,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    padding: 8,
  },
  tableRowAlt: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    padding: 8,
  },
  col1: { width: '40%' },
  col2: { width: '20%', textAlign: 'center' },
  col3: { width: '20%', textAlign: 'right' },
  col4: { width: '20%', textAlign: 'right', fontWeight: 'bold' },
  infoBox: {
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    fontWeight: 'bold',
    width: '30%',
  },
  infoValue: {
    width: '70%',
  },
  totalSection: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#3498db',
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
    width: '50%',
  },
  totalLabel: {
    fontWeight: 'bold',
    marginRight: 20,
    width: '60%',
    textAlign: 'right',
  },
  totalValue: {
    width: '40%',
    textAlign: 'right',
  },
  grandTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#7f8c8d',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 10,
  },
  link: {
    color: '#3498db',
    textDecoration: 'underline',
  },
  notes: {
    backgroundColor: '#fff9e6',
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
    marginTop: 20,
  },
  notesTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#f39c12',
  },
});

// Type definitions for the document data
interface DocumentData {
  documentNumber: string;
  documentDate: string;
  dueDate?: string;
  company: {
    name: string;
    address: string;
    email: string;
    phone: string;
    website?: string;
  };
  client: {
    name: string;
    address: string;
    email?: string;
    phone?: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  notes?: string;
}

// Example document component
const ExampleDocument = ({ data }: { data: DocumentData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.companyName}>{data.company.name}</Text>
          <Text style={{ fontSize: 10, color: '#7f8c8d' }}>
            Professional Document
          </Text>
        </View>
        <View style={styles.companyInfo}>
          <Text>{data.company.address}</Text>
          <Text>{data.company.email}</Text>
          <Text>{data.company.phone}</Text>
          {data.company.website && (
            <Link src={data.company.website} style={styles.link}>
              {data.company.website}
            </Link>
          )}
        </View>
      </View>

      {/* Document Title */}
      <Text style={styles.title}>Invoice</Text>

      {/* Document Information */}
      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Invoice Number:</Text>
          <Text style={styles.infoValue}>{data.documentNumber}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date:</Text>
          <Text style={styles.infoValue}>{data.documentDate}</Text>
        </View>
        {data.dueDate && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Due Date:</Text>
            <Text style={styles.infoValue}>{data.dueDate}</Text>
          </View>
        )}
      </View>

      {/* Client Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bill To</Text>
        <Text style={styles.text}>{data.client.name}</Text>
        <Text style={styles.text}>{data.client.address}</Text>
        {data.client.email && <Text style={styles.text}>{data.client.email}</Text>}
        {data.client.phone && <Text style={styles.text}>{data.client.phone}</Text>}
      </View>

      {/* Items Table */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Description</Text>
            <Text style={styles.col2}>Quantity</Text>
            <Text style={styles.col3}>Price</Text>
            <Text style={styles.col4}>Total</Text>
          </View>

          {/* Table Rows */}
          {data.items.map((item, index) => (
            <View
              key={index}
              style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
            >
              <Text style={styles.col1}>{item.description}</Text>
              <Text style={styles.col2}>{item.quantity}</Text>
              <Text style={styles.col3}>${item.price.toFixed(2)}</Text>
              <Text style={styles.col4}>${item.total.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Totals */}
      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>${data.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tax ({data.taxRate}%):</Text>
          <Text style={styles.totalValue}>${data.tax.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, styles.grandTotal]}>Total:</Text>
          <Text style={[styles.totalValue, styles.grandTotal]}>
            ${data.total.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Notes */}
      {data.notes && (
        <View style={styles.notes}>
          <Text style={styles.notesTitle}>Notes:</Text>
          <Text>{data.notes}</Text>
        </View>
      )}

      {/* Footer */}
      <Text
        style={styles.footer}
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages} • Generated on ${new Date().toLocaleDateString()}`
        }
        fixed
      />
    </Page>
  </Document>
);

// Example data
const exampleData: DocumentData = {
  documentNumber: 'INV-2024-001',
  documentDate: '2024-12-11',
  dueDate: '2024-12-25',
  company: {
    name: 'Your Company Name',
    address: '123 Business St, Suite 100, City, ST 12345',
    email: 'hello@yourcompany.com',
    phone: '(555) 123-4567',
    website: 'https://yourcompany.com',
  },
  client: {
    name: 'Client Company Inc.',
    address: '456 Client Ave, City, ST 67890',
    email: 'contact@clientcompany.com',
    phone: '(555) 987-6543',
  },
  items: [
    {
      description: 'Web Development Services',
      quantity: 40,
      price: 150.0,
      total: 6000.0,
    },
    {
      description: 'UI/UX Design',
      quantity: 20,
      price: 125.0,
      total: 2500.0,
    },
    {
      description: 'Consulting',
      quantity: 10,
      price: 200.0,
      total: 2000.0,
    },
  ],
  subtotal: 10500.0,
  taxRate: 10,
  tax: 1050.0,
  total: 11550.0,
  notes:
    'Payment is due within 14 days. Please include invoice number with payment. Thank you for your business!',
};

// Generate the PDF
(async () => {
  const outputPath = './example-invoice.pdf';
  console.log('Generating example PDF...');
  await renderToFile(<ExampleDocument data={exampleData} />, outputPath);
  console.log(`✓ PDF generated successfully: ${outputPath}`);
})();
