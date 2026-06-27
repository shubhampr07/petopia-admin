"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Upload, FileSpreadsheet, Download, CheckCircle2, XCircle, AlertCircle, ArrowLeft, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { importProductsAction, type ImportResult } from "./actions";

const REQUIRED_COLS = ["name", "price", "img"];
const ALL_COLS = [
  "id", "name", "brand", "category", "pet", "vibe",
  "price", "oldPrice", "badge", "tag", "img",
  "isBestseller", "isNewArrival", "detailDescription", "detailHighlights",
];

type ParsedRow = Record<string, string>;
type Stage = "idle" | "preview" | "importing" | "done";

function parseCSV(text: string): { headers: string[]; rows: ParsedRow[] } {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter((l) => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };

  function splitLine(line: string): string[] {
    const result: string[] = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = !inQ;
      } else if (c === "," && !inQ) {
        result.push(cur.trim()); cur = "";
      } else cur += c;
    }
    result.push(cur.trim());
    return result;
  }

  const headers = splitLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, ""));
  const rows = lines.slice(1).map((l) => {
    const vals = splitLine(l);
    const row: ParsedRow = {};
    headers.forEach((h, i) => { row[h] = vals[i] ?? ""; });
    return row;
  });
  return { headers, rows };
}

function validateHeaders(headers: string[]): string[] {
  return REQUIRED_COLS.filter((c) => !headers.includes(c));
}

export function ImportClient() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [headerErrors, setHeaderErrors] = useState<string[]>([]);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFile(file: File) {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { headers: h, rows: r } = parseCSV(text);
      const missing = validateHeaders(h);
      setHeaders(h);
      setRows(r);
      setHeaderErrors(missing);
      setStage("preview");
      setResult(null);
      setImportError(null);
    };
    reader.readAsText(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleImport() {
    startTransition(async () => {
      setStage("importing");
      const mapped = rows.map((r) => {
        const obj: Record<string, unknown> = {};
        ALL_COLS.forEach((col) => { if (r[col] !== undefined && r[col] !== "") obj[col] = r[col]; });
        return obj;
      });
      const res = await importProductsAction(mapped);
      if ("error" in res) {
        setImportError(res.error);
        setStage("preview");
      } else {
        setResult(res);
        setStage("done");
      }
    });
  }

  function reset() {
    setStage("idle");
    setFileName("");
    setHeaders([]);
    setRows([]);
    setHeaderErrors([]);
    setResult(null);
    setImportError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  const previewCols = ALL_COLS.filter((c) => headers.includes(c));
  const canImport = stage === "preview" && headerErrors.length === 0 && rows.length > 0;

  return (
    <div className="max-w-5xl space-y-6">

      {/* Header + template download */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            Upload a CSV file to create or update multiple products at once.
            Rows with an existing <code className="text-xs bg-muted px-1 rounded">id</code> will be updated; rows without will be created.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href="/api/export/products?template=1" download>
            <Download size={14} className="mr-1.5" /> Download template
          </a>
        </Button>
      </div>

      {/* Upload area */}
      {stage === "idle" && (
        <Card>
          <CardContent className="p-0">
            <div
              className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-muted-foreground/25 rounded-xl p-16 cursor-pointer hover:border-primary/40 hover:bg-muted/30 transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <div className="rounded-full bg-primary/10 p-5">
                <FileSpreadsheet size={32} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-base">Drop your CSV file here</p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse — .csv files only</p>
              </div>
              <Button variant="outline" size="sm" type="button">
                <Upload size={14} className="mr-1.5" /> Choose file
              </Button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {(stage === "preview" || stage === "importing") && (
        <>
          {/* File info */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <FileSpreadsheet size={18} className="text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{fileName}</p>
              <p className="text-xs text-muted-foreground">{rows.length} data row{rows.length !== 1 ? "s" : ""} detected</p>
            </div>
            <Button variant="ghost" size="sm" onClick={reset} disabled={isPending}>
              <Trash2 size={14} className="mr-1" /> Remove
            </Button>
          </div>

          {/* Header validation */}
          {headerErrors.length > 0 && (
            <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <XCircle size={18} className="text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-destructive">Missing required columns</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add these columns to your CSV: {headerErrors.map((c) => (
                    <code key={c} className="mx-0.5 px-1 py-0.5 bg-muted rounded text-xs">{c}</code>
                  ))}
                </p>
              </div>
            </div>
          )}

          {importError && (
            <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle size={18} className="text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{importError}</p>
            </div>
          )}

          {/* Column mapping */}
          <div className="flex flex-wrap gap-2">
            {ALL_COLS.map((col) => (
              <Badge
                key={col}
                variant={headers.includes(col) ? "default" : "outline"}
                className={!headers.includes(col) ? "text-muted-foreground" : ""}
              >
                {col}
                {REQUIRED_COLS.includes(col) && <span className="ml-1 text-[10px] opacity-70">*</span>}
              </Badge>
            ))}
          </div>

          {/* Data preview */}
          <Card>
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <p className="font-semibold text-sm">Preview — first 5 rows</p>
              <p className="text-xs text-muted-foreground">{rows.length} total rows</p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">#</TableHead>
                    {previewCols.map((c) => <TableHead key={c} className="text-xs">{c}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.slice(0, 5).map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-xs text-muted-foreground">{i + 2}</TableCell>
                      {previewCols.map((c) => (
                        <TableCell key={c} className="text-xs max-w-[160px] truncate">
                          {row[c] || <span className="text-muted-foreground/50">—</span>}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {rows.length > 5 && (
                    <TableRow>
                      <TableCell colSpan={previewCols.length + 1} className="text-xs text-center text-muted-foreground py-3">
                        …and {rows.length - 5} more rows
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button onClick={handleImport} disabled={!canImport || isPending}>
              {isPending ? "Importing…" : `Import ${rows.length} product${rows.length !== 1 ? "s" : ""}`}
            </Button>
            <Button variant="outline" onClick={reset} disabled={isPending}>Cancel</Button>
          </div>
        </>
      )}

      {/* Results */}
      {stage === "done" && result && (
        <Card>
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={28} className="text-emerald-500" />
              <div>
                <h3 className="font-bold text-lg">Import complete</h3>
                <p className="text-sm text-muted-foreground">Your catalog has been updated.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-2xl font-bold text-emerald-600">{result.created}</p>
                <p className="text-xs font-medium text-emerald-700 mt-1">Created</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-2xl font-bold text-blue-600">{result.updated}</p>
                <p className="text-xs font-medium text-blue-700 mt-1">Updated</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100">
                <p className="text-2xl font-bold text-red-600">{result.errors.length}</p>
                <p className="text-xs font-medium text-red-700 mt-1">Errors</p>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-destructive">Rows with errors:</p>
                <div className="rounded-lg border border-destructive/20 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Row</TableHead>
                        <TableHead>Error</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.errors.map((e) => (
                        <TableRow key={e.row}>
                          <TableCell className="font-mono text-sm">{e.row}</TableCell>
                          <TableCell className="text-sm text-destructive">{e.message}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button asChild><Link href="/products">View products</Link></Button>
              <Button variant="outline" onClick={reset}>Import another file</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
