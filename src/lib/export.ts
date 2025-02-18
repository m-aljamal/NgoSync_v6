import { type Table } from "@tanstack/react-table"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import { arabicFont } from "./arabicFont"

export function exportTableToCSV<TData>(
  /**
   * The table to export.
   * @type Table<TData>
   */
  table: Table<TData>,
  opts: {
    /**
     * The filename for the CSV file.
     * @default "table"
     * @example "tasks"
     */
    filename?: string
    /**
     * The columns to exclude from the CSV file.
     * @default []
     * @example ["select", "actions"]
     */
    excludeColumns?: (keyof TData | "select" | "actions")[]

    /**
     * Whether to export only the selected rows.
     * @default false
     */
    onlySelected?: boolean
  } = {}
): void {
  const { filename = "table", excludeColumns = [], onlySelected = false } = opts

  // Retrieve headers (column names)
  const headers = table
    .getAllLeafColumns()
    .map((column) => column.id)
    .filter((id) => !excludeColumns.includes(id))

  // Build CSV content
  const csvContent = [
    headers.join(","),
    ...(onlySelected
      ? table.getFilteredSelectedRowModel().rows
      : table.getRowModel().rows
    ).map((row) =>
      headers
        .map((header) => {
          const cellValue = row.getValue(header)
          // Handle values that might contain commas or newlines
          return typeof cellValue === "string"
            ? `"${cellValue.replace(/"/g, '""')}"`
            : cellValue
        })
        .join(",")
    ),
  ].join("\n")

  const utf8Bom = "\uFEFF"
  // Create a Blob with CSV content
  const blob = new Blob([utf8Bom + csvContent], {
    type: "text/csv;charset=utf-8;",
  })

  // Create a link and trigger the download
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const EDC_LOGO = "/images/edc-logo.png"
const HEADER = "/images/respiantLogo.png"

interface VoucherData {
  date: string
  no: string
  receivedFrom: string
  amount: string
  reason: string
  directorSignature?: string
  recipientSignature?: string
}

export function exportVoucherPDF1({
  date,
  no,
  receivedFrom,
  amount,
  reason,
  directorSignature,
  recipientSignature,
}: VoucherData) {
  // Create PDF document
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [148, 210],
  })

  doc.addFileToVFS("Arabic.ttf", arabicFont)
  doc.addFont("Arabic.ttf", "Arabic", "normal")
  doc.setFont("Arabic")

  doc.addImage(HEADER, "PNG", 15, 5, 180, 25)

    // Reset text color to black
    // doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)

      // No and Date with better alignment
  doc.text("No:", 20, 45)
  doc.text(no || "000546", 28, 45)
  
  doc.text(":االتاريخ", 190, 45, { align: "right" })
  doc.text(date || "19-04-2024", 178, 45, { align: "right" })


  // Center title with background

  // doc.setFillColor(52, 73, 94) // Dark blue color
  // doc.rect(85, 10, 40, 20, "F")
  // doc.setTextColor(255, 255, 255) // White text
  // doc.setFontSize(16)
  // doc.text("سند قبض", 105, 20, { align: "center" })
  // doc.text("Receipt Voucher", 105, 25, { align: "center" })

   
  // Right logo
  // doc.addImage(EDC_LOGO, "PNG", 155, 5, 40, 25)
  

  // doc.setFontSize(16)
  // doc.text("سند قبض", 105, 25, { align: "center" })

  // doc.setFontSize(16)
  // doc.text("Receipt Voucher", 105, 35, { align: "center" })

  // // Add form fields with bilingual labels
  // doc.setFontSize(14)

  // // No and Date (right-aligned Arabic)
  // doc.text(":التاريخ", 190, 60, { align: "right" })
  // doc.text(date || ".........................", 160, 60, { align: "right" })

  // doc.text(":No", 50, 60)
  // doc.text(no || ".........................", 60, 60)

  // // Received from
  // doc.text(": استلمنا من السيد / السادة", 190, 80, { align: "right" })
  // doc.text(
  //   receivedFrom ||
  //     ".................................................................",
  //   105,
  //   80,
  //   {
  //     align: "center",
  //   }
  // )

  // // Amount
  // doc.text(": مبلغا وقدره", 190, 100, { align: "right" })
  // doc.text(
  //   amount ||
  //     ".................................................................",
  //   105,
  //   100,
  //   { align: "center" }
  // )

  // // Reason
  // doc.text(": وذلك مقابل", 190, 120, { align: "right" })
  // doc.text(
  //   reason ||
  //     ".................................................................",
  //   105,
  //   120,
  //   { align: "center" }
  // )

  // // Signature lines
  // doc.setLineWidth(0.5)

  // // Director signature
  // doc.text("المدير", 40, 160)
  // doc.line(20, 180, 60, 180)
  // if (directorSignature) {
  //   doc.text(directorSignature, 40, 175, { align: "center" })
  // }

  // // Recipient signature
  // doc.text("المستلم", 160, 160)
  // doc.line(140, 180, 180, 180)
  // if (recipientSignature) {
  //   doc.text(recipientSignature, 160, 175, { align: "center" })
  // }

  // Save the PDF
  doc.save(`receipt_voucher_${no}.pdf`)
}

export function exportVoucherPDF({
  date,
  no,
  donorName,
  amount,
  reason,
  signature,
}: any) {
  const doc = new jsPDF({ orientation: "portrait" })
  doc.setFontSize(18)
  doc.text("Donation Voucher", 105, 20, { align: "center" })

  doc.setFontSize(18)
  doc.text(`Date: ${date}`, 20, 40)
  doc.text(`No: ${no}`, 20, 50)
  doc.text(`Donor Name: ${donorName}`, 20, 60)
  doc.text(`Amount: ${amount}`, 20, 70)
  doc.text(`Reason: ${reason}`, 20, 80)

  doc.text("Signature:", 20, 100)
  doc.text(signature, 50, 100)
  doc.line(
    40,
    doc.internal.pageSize.height - 30,
    80,
    doc.internal.pageSize.height - 30
  )
  doc.line(
    140,
    doc.internal.pageSize.height - 30,
    180,
    doc.internal.pageSize.height - 30
  )
  doc.save(`voucher_${no}.pdf`)
}

export function exportTableToPDF<TData>(
  table: Table<TData>,
  opts: {
    filename?: string
    excludeColumns?: (keyof TData | "select" | "actions")[]
    onlySelected?: boolean
  } = {}
) {
  const {
    filename = "voucher",
    excludeColumns = [],
    onlySelected = false,
  } = opts

  // Initialize jsPDF
  const doc = new jsPDF({ orientation: "portrait" })

  // Add title
  doc.setFontSize(18)
  doc.text("Voucher for Donation", 105, 20, { align: "center" })

  // Retrieve headers
  const headers = table
    .getAllLeafColumns()
    .map((column) => column.id)
    .filter((id) => !excludeColumns.includes(id))

  // Retrieve data rows
  const dataRows = (
    onlySelected
      ? table.getFilteredSelectedRowModel().rows
      : table.getRowModel().rows
  ).map((row) => headers.map((header) => row.getValue(header) || ""))

  // Add table to PDF
  autoTable(doc, {
    head: [headers],
    body: dataRows,
    startY: 30,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [22, 160, 133] },
    margin: { top: 30 },
  })

  // Footer
  doc.setFontSize(10)
  doc.text(
    "Thank you for your contribution!",
    105,
    doc.internal.pageSize.height - 10,
    {
      align: "center",
    }
  )

  // Save PDF
  doc.save(`${filename}.pdf`)
}

// import html2canvas from 'html2canvas';
// import { Button } from '@/components/ui/button';

// export function ExportVoucherImage({ date, no, donorName, amount, reason, signature }) {
//   const generateImage = () => {
//     const element = document.getElementById('voucher');
//     if (!element) return;

//     html2canvas(element).then((canvas) => {
//       const link = document.createElement('a');
//       link.href = canvas.toDataURL('image/jpeg');
//       link.download = `voucher_${no}.jpg`;
//       link.click();
//     });
//   };

//   return (
//     <div>
//       <div id="voucher" style={{ padding: 20, background: 'white', width: 300, textAlign: 'left', border: '1px solid black' }}>
//         <h2 style={{ textAlign: 'center' }}>Donation Voucher</h2>
//         <p>Date: {date}</p>
//         <p>No: {no}</p>
//         <p>Donor Name: {donorName}</p>
//         <p>Amount: {amount}</p>
//         <p>Reason: {reason}</p>
//         <p>Signature: {signature}</p>
//       </div>
//       <Button variant="outline" size="sm" onClick={generateImage}>
//         تحميل الصورة
//       </Button>
//     </div>
//   );
// }
