type ReceiptViewerProps = {
    receiptUrl: string;
  };
  
  export default function ReceiptViewer({ receiptUrl }: ReceiptViewerProps) {
    return (
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Order Receipt</h3>
        <a
          href={receiptUrl}
          download
          className="text-blue-600 underline"
        >
          Download Receipt (PDF)
        </a>
      </div>
    );
  }
  