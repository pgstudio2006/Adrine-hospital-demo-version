import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Beaker, Search } from "lucide-react";

interface TestResult {
  orderId: string;
  sampleId: string;
  uhid: string;
  patient: string;
  testName: string;
  category: string;
  resultValue: string;
  unit: string;
  refRange: string;
  flag: "" | "Low" | "High" | "Critical";
  status: "Pending" | "Entered" | "Modified";
  enteredBy?: string;
}

const TEST_RESULTS: TestResult[] = [
  { orderId: "LO-4521", sampleId: "S-20250308-001", uhid: "UH-2024-0045", patient: "Anita Sharma", testName: "Hemoglobin", category: "Hematology", resultValue: "", unit: "g/dL", refRange: "12.0–15.5", flag: "", status: "Pending" },
  { orderId: "LO-4521", sampleId: "S-20250308-001", uhid: "UH-2024-0045", patient: "Anita Sharma", testName: "WBC Count", category: "Hematology", resultValue: "", unit: "×10³/μL", refRange: "4.0–11.0", flag: "", status: "Pending" },
  { orderId: "LO-4521", sampleId: "S-20250308-001", uhid: "UH-2024-0045", patient: "Anita Sharma", testName: "Platelet Count", category: "Hematology", resultValue: "", unit: "×10³/μL", refRange: "150–400", flag: "", status: "Pending" },
  { orderId: "LO-4521", sampleId: "S-20250308-001", uhid: "UH-2024-0045", patient: "Anita Sharma", testName: "CRP", category: "Hematology", resultValue: "", unit: "mg/L", refRange: "0–6", flag: "", status: "Pending" },
  { orderId: "LO-4521", sampleId: "S-20250308-001", uhid: "UH-2024-0045", patient: "Anita Sharma", testName: "ESR", category: "Hematology", resultValue: "", unit: "mm/hr", refRange: "0–20", flag: "", status: "Pending" },
  { orderId: "LO-4514", sampleId: "S-20250308-007", uhid: "UH-2024-0155", patient: "Kiran Desai", testName: "Total Cholesterol", category: "Biochemistry", resultValue: "242", unit: "mg/dL", refRange: "<200", flag: "High", status: "Entered" },
  { orderId: "LO-4514", sampleId: "S-20250308-007", uhid: "UH-2024-0155", patient: "Kiran Desai", testName: "HDL", category: "Biochemistry", resultValue: "38", unit: "mg/dL", refRange: ">40", flag: "Low", status: "Entered" },
  { orderId: "LO-4514", sampleId: "S-20250308-007", uhid: "UH-2024-0155", patient: "Kiran Desai", testName: "LDL", category: "Biochemistry", resultValue: "168", unit: "mg/dL", refRange: "<100", flag: "High", status: "Entered" },
  { orderId: "LO-4514", sampleId: "S-20250308-007", uhid: "UH-2024-0155", patient: "Kiran Desai", testName: "Triglycerides", category: "Biochemistry", resultValue: "180", unit: "mg/dL", refRange: "<150", flag: "High", status: "Entered" },
  { orderId: "LO-4514", sampleId: "S-20250308-007", uhid: "UH-2024-0155", patient: "Kiran Desai", testName: "HbA1c", category: "Biochemistry", resultValue: "5.4", unit: "%", refRange: "4.0–5.6", flag: "", status: "Entered" },
];

const flagColor = (f: string) => {
  if (f === "Critical") return "destructive";
  if (f === "High" || f === "Low") return "secondary";
  return "outline";
};

export default function LabEntry() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState(TEST_RESULTS);

  const grouped = results.reduce((acc, r) => {
    const key = r.orderId;
    if (!acc[key]) acc[key] = { patient: r.patient, uhid: r.uhid, sampleId: r.sampleId, tests: [] };
    acc[key].tests.push(r);
    return acc;
  }, {} as Record<string, { patient: string; uhid: string; sampleId: string; tests: TestResult[] }>);

  const filteredKeys = Object.keys(grouped).filter(k => {
    const g = grouped[k];
    return g.patient.toLowerCase().includes(search.toLowerCase()) || g.uhid.includes(search) || k.includes(search);
  });

  const updateResult = (orderId: string, testName: string, value: string) => {
    setResults(prev => prev.map(r => {
      if (r.orderId === orderId && r.testName === testName) {
        const numVal = parseFloat(value);
        const ref = r.refRange;
        let flag: TestResult["flag"] = "";
        if (!isNaN(numVal)) {
          const match = ref.match(/([\d.]+)[–-]([\d.]+)/);
          const ltMatch = ref.match(/<([\d.]+)/);
          const gtMatch = ref.match(/>([\d.]+)/);
          if (match) {
            if (numVal < parseFloat(match[1])) flag = "Low";
            if (numVal > parseFloat(match[2])) flag = "High";
          } else if (ltMatch && numVal >= parseFloat(ltMatch[1])) {
            flag = "High";
          } else if (gtMatch && numVal <= parseFloat(gtMatch[1])) {
            flag = "Low";
          }
        }
        return { ...r, resultValue: value, flag, status: "Entered" as const };
      }
      return r;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Test Entry</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter and modify test results with auto-flagging</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search order, patient, UHID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {filteredKeys.map(orderId => {
        const group = grouped[orderId];
        const allEntered = group.tests.every(t => t.status === "Entered");
        const hasFlags = group.tests.some(t => t.flag);

        return (
          <Card key={orderId} className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Beaker className="h-4 w-4" />
                    <span className="font-mono">{orderId}</span>
                    <span className="font-normal text-muted-foreground">· {group.sampleId}</span>
                  </CardTitle>
                  <p className="text-sm text-foreground mt-1">{group.patient} <span className="text-muted-foreground">· {group.uhid}</span></p>
                </div>
                <div className="flex gap-2">
                  {hasFlags && <Badge variant="secondary" className="text-xs gap-1"><AlertTriangle className="h-3 w-3" /> Abnormal values</Badge>}
                  <Button size="sm" disabled={!allEntered} className="text-xs h-7">Submit for Validation</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Reference Range</TableHead>
                    <TableHead>Flag</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.tests.map(t => (
                    <TableRow key={t.testName}>
                      <TableCell className="text-sm font-medium text-foreground">{t.testName}</TableCell>
                      <TableCell>
                        <Input
                          className="w-24 h-8 text-sm font-mono"
                          value={t.resultValue}
                          placeholder="—"
                          onChange={e => updateResult(orderId, t.testName, e.target.value)}
                        />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{t.unit}</TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">{t.refRange}</TableCell>
                      <TableCell>
                        {t.flag && <Badge variant={flagColor(t.flag)} className="text-xs">{t.flag}</Badge>}
                      </TableCell>
                      <TableCell><Badge variant={t.status === "Entered" ? "default" : "outline"} className="text-xs">{t.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
