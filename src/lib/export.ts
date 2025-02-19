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

const EMPTY = "/images/empty-with-sign.jpg"
interface VoucherData {
  date: string
  no: string
  receivedFrom: string
  amount: string
  reason: string
}

export function exportVoucherPDF1({
  date,
  no,
  receivedFrom,
  amount,
  reason,
}: VoucherData) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [148, 210],
  })

  doc.addFileToVFS("Arabic.ttf", arabicFont)
  doc.addFont("Arabic.ttf", "Arabic", "normal")
  doc.setFont("Arabic")

  const pageWidth = 205
  const pageHeight = 150

  doc.addImage(EMPTY, "JPG", 0, 0, pageWidth, pageHeight)

  doc.setTextColor(128, 0, 0)
  doc.text(no || "", 29, 41)
  doc.setTextColor(0, 0, 128)
  doc.text(date || "", 152, 43)
  doc.text(receivedFrom || "", 135, 54, { align: "right" })
  doc.text(amount || "", 128, 67, { align: "center" })
  doc.text(reason || "", 132, 80, { align: "center" })

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
