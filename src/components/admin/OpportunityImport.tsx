"use client";
import { importOpportunities } from "@/services/opportunityImportService";
import { useState } from "react";
import * as XLSX from "xlsx";

import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function OpportunityImport() {

  const [rows, setRows] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (!file) return;

    setLoading(true);

    const reader = new FileReader();

    reader.onload = (evt) => {

      const data = evt.target?.result;

      const workbook = XLSX.read(data, {
        type: "binary",
      });

      const sheet =
        workbook.Sheets[workbook.SheetNames[0]];

      const json =
        XLSX.utils.sheet_to_json(sheet);

      setRows(json);

      setLoading(false);

    };

    reader.readAsBinaryString(file);

  };

  return (

    <div className="space-y-8">

      <Card className="rounded-3xl">

        <CardContent className="p-10">

          <div className="border-2 border-dashed rounded-3xl p-12 text-center">

            <UploadCloud className="mx-auto h-14 w-14 text-gold mb-5" />

            <h2 className="text-2xl font-bold mb-3">

              Upload Excel File

            </h2>

            <p className="text-muted-foreground mb-6">

              Supported format:
              .xlsx

            </p>

            <input

              type="file"

              accept=".xlsx"

              onChange={handleUpload}

            />

          </div>

        </CardContent>

      </Card>

      {loading && (

        <Card>

          <CardContent className="p-8">

            Reading Excel...

          </CardContent>

        </Card>

      )}

      {rows.length > 0 && (

        <>

          <Card className="rounded-3xl">

            <CardContent className="p-8">

              <div className="flex items-center gap-3 mb-6">

                <CheckCircle2 className="text-green-600" />

                <h2 className="text-2xl font-bold">

                  Preview

                </h2>

              </div>

              <p>

                Total Records :

                <strong>

                  {" "}

                  {rows.length}

                </strong>

              </p>

            </CardContent>

          </Card>

          <Card>

            <CardContent className="overflow-auto">

              <table className="w-full">

                <thead>

                  <tr>

                    {Object.keys(rows[0]).map((key) => (

                      <th
                        key={key}
                        className="text-left p-3 border-b"
                      >
                        {key}
                      </th>

                    ))}

                  </tr>

                </thead>

                <tbody>

                  {rows.map((row, index) => (

                    <tr key={index}>

                      {Object.values(row).map(
                        (value: any, i) => (

                          <td
                            key={i}
                            className="p-3 border-b"
                          >
                            {String(value)}
                          </td>

                        )
                      )}

                    </tr>

                  ))}

                </tbody>

              </table>

            </CardContent>

          </Card>

          <div className="flex justify-end">
  <Button
    size="lg"
    onClick={async () => {
      const result = await importOpportunities(rows);

console.log(result);

alert(`
Imported : ${result.imported}

Skipped : ${result.skipped}

Failed : ${result.failed}

Errors:

${result.errors.join("\n")}
`);
    }}
  >
    <FileSpreadsheet className="mr-2 h-5 w-5" />
    Import Opportunities
  </Button>
</div>

        </>

      )}

    </div>

  );

}