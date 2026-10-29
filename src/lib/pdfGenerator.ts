import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice } from '@/types';
import { APP_CONFIG } from './constants';

export function generateInvoicePDF(invoice: Invoice, customerDetails?: { name?: string; email?: string; company?: string }) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [99, 102, 241]; // #6366F1
  const darkBg = [17, 24, 39]; // #111827
  const grayText = [100, 116, 139];
  const paidColor = [16, 185, 129]; // emerald

  // Background Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 42, 'F');

  // Accent Gradient Bar
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 41, 210, 1.5, 'F');

  // Logo & Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('SubSync', 14, 22);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(165, 180, 252);
  doc.text('SaaS Subscription & Billing Engine', 14, 28);

  // Invoice Number & Date
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 196, 20, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(invoice.invoiceNumber, 196, 26, { align: 'right' });
  doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 196, 32, { align: 'right' });

  // Bill From & Bill To Sections
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('BILLED FROM:', 14, 54);
  doc.text('BILLED TO:', 110, 54);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.text(APP_CONFIG.company.name, 14, 60);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(9);
  doc.text(APP_CONFIG.company.address, 14, 65);
  doc.text(APP_CONFIG.company.city, 14, 70);
  doc.text(`VAT: ${APP_CONFIG.company.vatNumber}`, 14, 75);
  doc.text(`Email: ${APP_CONFIG.company.email}`, 14, 80);

  // Customer info
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(customerDetails?.name || invoice.userName || 'Subscriber', 110, 60);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(9);
  if (customerDetails?.company) {
    doc.text(customerDetails.company, 110, 65);
    doc.text(customerDetails?.email || invoice.userEmail || '', 110, 70);
  } else {
    doc.text(customerDetails?.email || invoice.userEmail || '', 110, 65);
  }
  doc.text('Account: Active Subscriber', 110, customerDetails?.company ? 75 : 70);

  // Status Badge
  const statusX = 160;
  const statusY = 78;
  const isPaid = invoice.status === 'PAID';
  doc.setFillColor(isPaid ? 209 : 254, isPaid ? 250 : 226, isPaid ? 229 : 226);
  doc.roundedRect(statusX, statusY, 36, 8, 2, 2, 'F');
  doc.setTextColor(isPaid ? 16 : 220, isPaid ? 149 : 38, isPaid ? 89 : 38);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`STATUS: ${invoice.status}`, statusX + 18, statusY + 5.5, { align: 'center' });

  // Items Table
  const tableRows = (invoice.items && invoice.items.length > 0)
    ? invoice.items.map((item) => [
        item.description,
        item.quantity.toString(),
        `$${item.unitPrice.toFixed(2)}`,
        `$${item.amount.toFixed(2)}`,
      ])
    : [
        [
          invoice.itemDescription,
          '1',
          `$${invoice.amount.toFixed(2)}`,
          `$${invoice.amount.toFixed(2)}`,
        ],
      ];

  autoTable(doc, {
    startY: 92,
    head: [['Description', 'Qty', 'Unit Price', 'Amount']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 105 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 30, halign: 'right' },
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: [51, 65, 85],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 130;

  // Totals Summary Box
  const summaryX = 125;
  let currentY = finalY + 10;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Subtotal:', summaryX, currentY);
  doc.setTextColor(15, 23, 42);
  doc.text(`$${invoice.subtotal.toFixed(2)}`, 196, currentY, { align: 'right' });

  currentY += 6;
  doc.setTextColor(100, 116, 139);
  doc.text('Tax (0%):', summaryX, currentY);
  doc.setTextColor(15, 23, 42);
  doc.text(`$${invoice.taxAmount.toFixed(2)}`, 196, currentY, { align: 'right' });

  currentY += 4;
  doc.setDrawColor(226, 232, 240);
  doc.line(summaryX, currentY, 196, currentY);

  currentY += 6;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(99, 102, 241);
  doc.text('Total Paid:', summaryX, currentY);
  doc.text(`$${invoice.amount.toFixed(2)} USD`, 196, currentY, { align: 'right' });

  // Payment Method note
  currentY += 12;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, finalY + 10, 95, 24, 2, 2, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('PAYMENT METHOD', 18, finalY + 16);
  doc.setFont('helvetica', 'normal');
  doc.text(`${invoice.paymentMethodBrand || 'Visa'} ending in **** ${invoice.paymentMethodLast4 || '4242'}`, 18, finalY + 22);
  doc.text(`Receipt ID: ${invoice.id}`, 18, finalY + 28);

  // Footer Note
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(226, 232, 240);
  doc.line(14, pageHeight - 20, 196, pageHeight - 20);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Thank you for choosing SubSync. For billing queries, email billing@subsync.io.', 105, pageHeight - 14, { align: 'center' });
  doc.text('Automated Subscription Platform • Generated on ' + new Date().toUTCString(), 105, pageHeight - 10, { align: 'center' });

  // Save to file in browser
  doc.save(`${invoice.invoiceNumber}.pdf`);
}
