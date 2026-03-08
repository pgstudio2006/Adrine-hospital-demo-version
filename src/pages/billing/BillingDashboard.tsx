import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IndianRupee, TrendingUp, FileText, CreditCard, AlertTriangle, Clock, Building2, ShieldCheck } from "lucide-react";

const stats = [
  { label: "Today's Revenue", value: "₹4,82,350", icon: IndianRupee, trend: "+12% vs yesterday", color: "text-green-600" },
  { label: "Pending Bills", value: "47", icon: Clock, trend: "₹8,45,200 outstanding" },
  { label: "Insurance Claims", value: "23", icon: ShieldCheck, trend: "5 awaiting approval" },
  { label: "Invoices Generated", value: "156", icon: FileText, trend: "Today" },
];

const revenueBreakdown = [
  { dept: "OPD Consultations", amount: 125400, pct: 26 },
  { dept: "IPD Room Charges", amount: 98500, pct: 20 },
  { dept: "Pharmacy", amount: 87200, pct: 18 },
  { dept: "Laboratory", amount: 72300, pct: 15 },
  { dept: "Radiology", amount: 56800, pct: 12 },
  { dept: "Procedures", amount: 42150, pct: 9 },
];

const recentTransactions = [
  { id: "TXN-8901", patient: "Ravi Sharma", uhid: "UH-10042", type: "OPD", amount: 1500, method: "UPI", status: "Paid", time: "10 min ago" },
  { id: "TXN-8900", patient: "Anita Desai", uhid: "UH-10038", type: "Pharmacy", amount: 1134, method: "Insurance", status: "Insurance", time: "25 min ago" },
  { id: "TXN-8899", patient: "Suresh Kumar", uhid: "UH-10035", type: "IPD", amount: 45000, method: "Card", status: "Partial", time: "1 hr ago" },
  { id: "TXN-8898", patient: "Meena Joshi", uhid: "UH-10029", type: "Radiology", amount: 1200, method: "Cash", status: "Paid", time: "2 hr ago" },
  { id: "TXN-8897", patient: "Vikram Singh", uhid: "UH-10021", type: "Emergency", amount: 8500, method: "Cash", status: "Pending", time: "3 hr ago" },
];

const payStatusColor: Record<string, string> = {
  Paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Partial: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  Insurance: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Refunded: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function BillingDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing & Finance Dashboard</h1>
        <p className="text-muted-foreground text-sm">Hospital financial operations overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.trend}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Breakdown */}
        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Revenue by Department</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {revenueBreakdown.map(r => (
              <div key={r.dept} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">{r.dept}</span>
                  <span className="font-medium">₹{r.amount.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>TXN ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map(t => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-sm">{t.id}</TableCell>
                    <TableCell>
                      <div><span className="font-medium">{t.patient}</span><br /><span className="text-xs text-muted-foreground">{t.uhid}</span></div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{t.type}</Badge></TableCell>
                    <TableCell className="font-medium">₹{t.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-sm">{t.method}</TableCell>
                    <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${payStatusColor[t.status]}`}>{t.status}</span></TableCell>
                    <TableCell className="text-muted-foreground text-xs">{t.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button><FileText className="h-4 w-4 mr-2" /> Generate Bill</Button>
          <Button variant="outline"><CreditCard className="h-4 w-4 mr-2" /> Record Payment</Button>
          <Button variant="outline"><ShieldCheck className="h-4 w-4 mr-2" /> Insurance Claim</Button>
          <Button variant="outline"><Building2 className="h-4 w-4 mr-2" /> Corporate Invoice</Button>
        </CardContent>
      </Card>
    </div>
  );
}
