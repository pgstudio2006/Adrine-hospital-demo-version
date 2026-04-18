import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, CheckCircle, LogOut, Search } from "lucide-react";
import { useHospital } from "@/stores/hospitalStore";
import { toast } from "sonner";

const EDUCATION_ITEMS = [
  { id: 1, category: "Medication", instruction: "Explain medication schedule and possible side effects." },
  { id: 2, category: "Wound Care", instruction: "Share dressing care and warning signs." },
  { id: 3, category: "Diet", instruction: "Provide personalized diet plan from treating team." },
  { id: 4, category: "Activity", instruction: "Counsel on mobility limits and safe activity progression." },
  { id: 5, category: "Follow-up", instruction: "Confirm follow-up date, time, and department." },
  { id: 6, category: "Emergency", instruction: "Educate on danger signs and emergency contact route." },
];

export default function NurseDischarge() {
  const { admissions, nursingRounds, prescriptions, updateAdmissionStatus } = useHospital();
  const [search, setSearch] = useState("");
  const [selectedAdmissionId, setSelectedAdmissionId] = useState<string | null>(null);
  const [educationByAdmission, setEducationByAdmission] = useState<Record<string, Record<number, boolean>>>({});
  const [docsByAdmission, setDocsByAdmission] = useState<Record<string, boolean>>({});
  const [dischargeNotesByAdmission, setDischargeNotesByAdmission] = useState<Record<string, string>>({});

  const activeDischarges = useMemo(
    () => admissions.filter((admission) => admission.status !== "discharged"),
    [admissions],
  );

  const completedDischarges = useMemo(
    () => admissions.filter((admission) => admission.status === "discharged"),
    [admissions],
  );

  const filteredQueue = useMemo(() => {
    const query = search.toLowerCase();
    return activeDischarges.filter((admission) =>
      admission.patientName.toLowerCase().includes(query)
      || admission.uhid.toLowerCase().includes(query)
      || admission.ward.toLowerCase().includes(query),
    );
  }, [activeDischarges, search]);

  const selectedAdmission = useMemo(
    () => activeDischarges.find((admission) => admission.id === (selectedAdmissionId ?? activeDischarges[0]?.id)),
    [activeDischarges, selectedAdmissionId],
  );

  const getChecklistState = (admissionId: string, uhid: string) => {
    const latestRound = nursingRounds.find((round) => round.admissionId === admissionId);
    const rxForPatient = prescriptions.filter((rx) => rx.uhid === uhid);
    const medsExplained = rxForPatient.length === 0 || rxForPatient.every((rx) => rx.status === "Dispensed" || rx.status === "Partially dispensed");
    const educationMap = educationByAdmission[admissionId] || {};
    const educationDone = EDUCATION_ITEMS.every((item) => educationMap[item.id]);

    return {
      vitals: Boolean(latestRound),
      meds: medsExplained,
      education: educationDone,
      docs: Boolean(docsByAdmission[admissionId]),
    };
  };

  const handleMarkReady = (admissionId: string, uhid: string) => {
    const checklist = getChecklistState(admissionId, uhid);
    if (!checklist.vitals || !checklist.meds || !checklist.education || !checklist.docs) {
      toast.error("Complete all checklist items before marking discharge-ready.");
      return;
    }
    updateAdmissionStatus(admissionId, "discharge-ready");
  };

  const handleMarkDischarged = (admissionId: string) => {
    updateAdmissionStatus(admissionId, "discharged");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Discharge</h1>
        <p className="text-sm text-muted-foreground mt-1">Discharge preparation, patient education & documentation</p>
      </div>

      <Tabs defaultValue="queue">
        <TabsList>
          <TabsTrigger value="queue"><LogOut className="h-3.5 w-3.5 mr-1" /> Discharge Queue</TabsTrigger>
          <TabsTrigger value="education"><BookOpen className="h-3.5 w-3.5 mr-1" /> Patient Education</TabsTrigger>
          <TabsTrigger value="completed"><CheckCircle className="h-3.5 w-3.5 mr-1" /> Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search patient..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>

          {filteredQueue.map((admission) => {
            const checklist = getChecklistState(admission.id, admission.uhid);
            const queueStatus = admission.status === "discharge-ready" ? "Ready for Billing" : "Pending Nursing";
            return (
            <Card key={admission.id} className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{admission.patientName} <span className="text-muted-foreground font-normal">· {admission.uhid}</span></p>
                    <p className="text-xs text-muted-foreground">{admission.ward} · {admission.bed} · {admission.attendingDoctor} · {admission.primaryDiagnosis}</p>
                  </div>
                  <Badge variant={admission.status === "discharge-ready" ? "secondary" : "default"} className="text-xs">{queueStatus}</Badge>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Checkbox checked={checklist.vitals} disabled /> <span className="text-foreground">Final vitals recorded</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Checkbox checked={checklist.meds} disabled /> <span className="text-foreground">Discharge meds explained</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Checkbox checked={checklist.education} disabled /> <span className="text-foreground">Patient education done</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Checkbox checked={checklist.docs} disabled /> <span className="text-foreground">Documents prepared</span>
                  </div>
                </div>

                <div className="mb-3">
                  <Label className="text-xs">Nursing Discharge Note</Label>
                  <Textarea
                    placeholder="Patient and attendant counseled. Handover complete."
                    value={dischargeNotesByAdmission[admission.id] || ""}
                    onChange={(event) => setDischargeNotesByAdmission((prev) => ({ ...prev, [admission.id]: event.target.value }))}
                    className="text-xs mt-1 min-h-[56px]"
                  />
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => setSelectedAdmissionId(admission.id)}>Open Education</Button>
                  <Button
                    size="sm"
                    className="text-xs"
                    disabled={!checklist.vitals || !checklist.meds || !checklist.education || !checklist.docs || admission.status === "discharge-ready"}
                    onClick={() => handleMarkReady(admission.id, admission.uhid)}
                  >
                    Mark Ready
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="text-xs"
                    disabled={admission.status !== "discharge-ready"}
                    onClick={() => handleMarkDischarged(admission.id)}
                  >
                    Mark Discharged
                  </Button>
                </div>
              </CardContent>
            </Card>
            );
          })}

          {filteredQueue.length === 0 && (
            <Card className="border-border"><CardContent className="p-6 text-sm text-muted-foreground">No active discharge candidates found.</CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="education" className="mt-4 space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Patient Education {selectedAdmission ? `- ${selectedAdmission.patientName} (${selectedAdmission.uhid})` : ""}
              </CardTitle>
              <p className="text-xs text-muted-foreground">Checklist completion updates discharge readiness and downstream billing handoff.</p>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border">
              {EDUCATION_ITEMS.map((item) => (
                <div key={item.id} className="px-4 py-3 flex items-center gap-3">
                  <Checkbox
                    checked={selectedAdmission ? Boolean(educationByAdmission[selectedAdmission.id]?.[item.id]) : false}
                    onCheckedChange={(checked) => {
                      if (!selectedAdmission) return;
                      setEducationByAdmission((prev) => ({
                        ...prev,
                        [selectedAdmission.id]: {
                          ...(prev[selectedAdmission.id] || {}),
                          [item.id]: Boolean(checked),
                        },
                      }));
                    }}
                  />
                  <Badge variant="outline" className="text-xs min-w-[90px] justify-center">{item.category}</Badge>
                  <span className="text-sm text-foreground">{item.instruction}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">Print Instructions</Button>
            <Button
              className="flex-1"
              onClick={() => {
                if (!selectedAdmission) return;
                setDocsByAdmission((prev) => ({ ...prev, [selectedAdmission.id]: true }));
                toast.success("Education and documentation marked complete.");
              }}
            >
              Mark Education Complete
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Bed</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Discharged</TableHead>
                    <TableHead>Nurse</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedDischarges.map((admission) => {
                    const finalRound = nursingRounds.find((round) => round.admissionId === admission.id);
                    return (
                    <TableRow key={admission.id}>
                      <TableCell>
                        <p className="font-medium text-sm text-foreground">{admission.patientName}</p>
                        <p className="text-xs text-muted-foreground">{admission.uhid}</p>
                      </TableCell>
                      <TableCell className="text-sm">{admission.ward} · {admission.bed}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{admission.attendingDoctor}</TableCell>
                      <TableCell className="text-sm">{admission.primaryDiagnosis}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{admission.admittedAt}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{finalRound?.nurse || "Nursing Team"}</TableCell>
                    </TableRow>
                    );
                  })}
                  {completedDischarges.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-6">No completed discharges yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
