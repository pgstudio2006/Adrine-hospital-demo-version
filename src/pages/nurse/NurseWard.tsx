import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, Bed, Search, UserCheck, Users } from "lucide-react";
import { useHospital } from "@/stores/hospitalStore";

const priorityVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  high: "destructive",
  medium: "secondary",
  low: "outline",
};

const nurseRoster = ["Nurse Priya", "Nurse Rekha", "Nurse Sunita", "Nurse Kavita", "Nurse Deepa"];

export default function NurseWard() {
  const { admissions, nursingRounds, assignAdmissionBed } = useHospital();
  const [search, setSearch] = useState("");
  const [selectedWard, setSelectedWard] = useState("all");
  const [selectedAdmissionId, setSelectedAdmissionId] = useState("");
  const [transferWard, setTransferWard] = useState("");
  const [transferBed, setTransferBed] = useState("");
  const [transferNurse, setTransferNurse] = useState("Nurse Priya");
  const [doctorRoundAt, setDoctorRoundAt] = useState("11:00 AM");
  const [transferReason, setTransferReason] = useState("");

  const wardOptions = useMemo(() => {
    const wards = Array.from(new Set(admissions.map((admission) => admission.ward)));
    return wards.sort((left, right) => left.localeCompare(right));
  }, [admissions]);

  const activeAdmissions = useMemo(() => admissions.filter((admission) => admission.status !== "discharged"), [admissions]);

  const filtered = useMemo(() => {
    return activeAdmissions.filter((admission) => {
      const query = search.toLowerCase();
      const matchSearch =
        admission.patientName.toLowerCase().includes(query) ||
        admission.uhid.toLowerCase().includes(query) ||
        admission.id.toLowerCase().includes(query) ||
        admission.attendingDoctor.toLowerCase().includes(query);
      const matchWard = selectedWard === "all" || admission.ward === selectedWard;
      return matchSearch && matchWard;
    });
  }, [activeAdmissions, search, selectedWard]);

  const selectedAdmission = admissions.find((admission) => admission.id === selectedAdmissionId) ?? null;

  const latestRoundByAdmission = useMemo(() => {
    const map = new Map<string, (typeof nursingRounds)[number]>();
    nursingRounds.forEach((round) => {
      if (!map.has(round.admissionId)) {
        map.set(round.admissionId, round);
      }
    });
    return map;
  }, [nursingRounds]);

  const handovers = useMemo(() => nursingRounds.slice(0, 8), [nursingRounds]);

  const infectionWatchlist = useMemo(() => {
    return admissions.filter((admission) => {
      const recentRound = latestRoundByAdmission.get(admission.id);
      return (
        admission.nursingPriority === "high" ||
        admission.status === "icu" ||
        admission.journeyType === "Trauma" ||
        (recentRound ? recentRound.spo2 < 94 || recentRound.temp >= 100 : false)
      );
    });
  }, [admissions, latestRoundByAdmission]);

  const handleTransfer = () => {
    if (!selectedAdmissionId || !transferWard.trim() || !transferBed.trim()) {
      return;
    }

    assignAdmissionBed(
      selectedAdmissionId,
      transferWard.trim(),
      transferBed.trim(),
      transferNurse.trim() || undefined,
      doctorRoundAt.trim() || undefined,
      transferReason.trim() || undefined,
      transferNurse.trim() || undefined,
    );

    setTransferReason("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Ward</h1>
          <p className="text-sm text-muted-foreground mt-1">Patient assignments, shift handovers, and infection control</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm"><ArrowRightLeft className="h-4 w-4 mr-1" /> Transfer Patient</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Transfer Patient Care</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Admission</Label>
                <Select value={selectedAdmissionId} onValueChange={setSelectedAdmissionId}>
                  <SelectTrigger><SelectValue placeholder="Select inpatient" /></SelectTrigger>
                  <SelectContent>
                    {admissions.map((admission) => (
                      <SelectItem key={admission.id} value={admission.id}>
                        {admission.patientName} · {admission.ward} ({admission.bed})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Transfer to Ward</Label>
                <Input value={transferWard} onChange={(event) => setTransferWard(event.target.value)} placeholder="Ward / unit" />
              </div>
              <div>
                <Label>Transfer to Bed</Label>
                <Input value={transferBed} onChange={(event) => setTransferBed(event.target.value)} placeholder="Bed / bay" />
              </div>
              <div>
                <Label>Assigned Nurse</Label>
                <Select value={transferNurse} onValueChange={setTransferNurse}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {nurseRoster.map((nurse) => (
                      <SelectItem key={nurse} value={nurse}>{nurse}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Next Doctor Round</Label>
                <Input value={doctorRoundAt} onChange={(event) => setDoctorRoundAt(event.target.value)} placeholder="e.g. 11:00 AM" />
              </div>
              <div>
                <Label>Transfer Reason</Label>
                <Textarea value={transferReason} onChange={(event) => setTransferReason(event.target.value)} placeholder="Reason for transfer..." />
              </div>
              <Button className="w-full" onClick={handleTransfer}>Confirm Transfer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="assignments">
        <TabsList>
          <TabsTrigger value="assignments"><Users className="h-3.5 w-3.5 mr-1" /> Assignments</TabsTrigger>
          <TabsTrigger value="handover"><ArrowRightLeft className="h-3.5 w-3.5 mr-1" /> Shift Handover</TabsTrigger>
          <TabsTrigger value="infection"><UserCheck className="h-3.5 w-3.5 mr-1" /> Infection Control</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="mt-4 space-y-4">
          <div className="grid gap-3 md:grid-cols-[1fr_200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search patient, UHID, admission, or doctor..." value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" />
            </div>
            <Select value={selectedWard} onValueChange={setSelectedWard}>
              <SelectTrigger><SelectValue placeholder="All wards" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wards</SelectItem>
                {wardOptions.map((ward) => (
                  <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Ward / Bed</TableHead>
                    <TableHead>Nurse</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Next Round</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">No admitted patients match the current filter.</TableCell>
                    </TableRow>
                  ) : filtered.map((admission) => (
                    <TableRow key={admission.id}>
                      <TableCell>
                        <p className="font-medium text-sm text-foreground">{admission.patientName}</p>
                        <p className="text-xs text-muted-foreground">{admission.uhid} · {admission.id}</p>
                      </TableCell>
                      <TableCell className="text-sm">{admission.ward} · {admission.bed}</TableCell>
                      <TableCell className="text-sm">{admission.assignedNurse || "Nurse Priya"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{admission.roundingDoctor || admission.attendingDoctor}</TableCell>
                      <TableCell className="text-sm">{admission.nextDoctorRoundAt || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={priorityVariant[admission.nursingPriority]} className="text-xs capitalize">{admission.nursingPriority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={admission.status === "discharged" ? "outline" : "default"} className="text-xs">{admission.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="handover" className="mt-4 space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Today's Shift Handovers</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border">
              {handovers.length === 0 ? (
                <div className="px-4 py-6 text-sm text-muted-foreground">No nursing rounds recorded yet.</div>
              ) : handovers.map((round) => (
                <div key={round.id} className="px-4 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{round.patientName} <span className="text-muted-foreground font-normal">· {round.uhid}</span></p>
                      <p className="text-xs text-muted-foreground">{round.nurse} · {round.shift} · {round.ward} · {round.bed}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{round.recordedAt}</span>
                  </div>
                  <p className="text-sm text-foreground bg-muted/50 rounded p-2">{round.notes}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="infection" className="mt-4 space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Safety Watchlist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {infectionWatchlist.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active watchlist patients found.</p>
              ) : (
                infectionWatchlist.map((admission) => {
                  const latestRound = latestRoundByAdmission.get(admission.id);
                  const flag = latestRound && latestRound.spo2 < 94 ? "SpO2 low" : latestRound && latestRound.temp >= 100 ? "Temperature high" : admission.nursingPriority === "high" ? "High acuity" : "Ward watch";

                  return (
                    <div key={admission.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-sm">{admission.patientName}</p>
                          <p className="text-xs text-muted-foreground">{admission.id} · {admission.ward} · {admission.bed}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="destructive" className="text-xs">{flag}</Badge>
                          {latestRound?.painScore !== undefined && <Badge variant="outline" className="text-xs">Pain {latestRound.painScore}/10</Badge>}
                        </div>
                      </div>
                      {latestRound && (
                        <p className="mt-2 text-xs text-muted-foreground">Latest round by {latestRound.nurse} at {latestRound.recordedAt} · BP {latestRound.bp} · Pulse {latestRound.pulse} · SpO2 {latestRound.spo2}%</p>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
