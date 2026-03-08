import { useState, useRef, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Mic, MicOff, Sparkles, Loader2, CheckCircle2, XCircle,
  Languages, Play, Square, Edit3, ArrowRight, RotateCcw,
  Stethoscope, Pill, FlaskConical, AlertTriangle
} from 'lucide-react';
import type { Complaint } from './ConsultationComplaints';
import type { Diagnosis } from './ConsultationDiagnosis';
import type { Medication } from './ConsultationMedications';
import type { LabTest, RadiologyOrder } from './ConsultationOrders';

// Indian languages supported by Web Speech API
const LANGUAGES = [
  { code: 'en-IN', label: 'English (India)' },
  { code: 'hi-IN', label: 'हिन्दी (Hindi)' },
  { code: 'bn-IN', label: 'বাংলা (Bengali)' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)' },
  { code: 'te-IN', label: 'తెలుగు (Telugu)' },
  { code: 'mr-IN', label: 'मराठी (Marathi)' },
  { code: 'gu-IN', label: 'ગુજરાતી (Gujarati)' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml-IN', label: 'മലയാളം (Malayalam)' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'or-IN', label: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'ur-IN', label: 'اردو (Urdu)' },
];

interface ScribeResult {
  complaints: Complaint[];
  diagnoses: Diagnosis[];
  medications: Medication[];
  labTests: LabTest[];
  radiologyOrders: RadiologyOrder[];
  advice: string;
  followUpDays: string;
  vitals: Record<string, string>;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: (result: ScribeResult) => void;
  patientName: string;
}

type Step = 'record' | 'processing' | 'review';

export default function ConsultationAIScribe({ open, onClose, onApply, patientName }: Props) {
  const [step, setStep] = useState<Step>('record');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [language, setLanguage] = useState('en-IN');
  const [result, setResult] = useState<ScribeResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editableTranscript, setEditableTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep('record');
      setTranscript('');
      setInterimText('');
      setResult(null);
      setIsProcessing(false);
      setEditableTranscript('');
    }
  }, [open]);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech recognition not supported in this browser. Use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += t + ' ';
        } else {
          interim += t;
        }
      }
      if (final) {
        setTranscript(prev => prev + final);
      }
      setInterimText(interim);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        toast.error(`Speech error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      // Auto-restart if still in listening mode
      if (recognitionRef.current) {
        try { recognition.start(); } catch { /* ignore */ }
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    toast.success('Listening... Speak naturally');
  }, [language]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimText('');
  }, []);

  const processTranscript = async () => {
    const text = editableTranscript || transcript;
    if (!text.trim()) {
      toast.error('No conversation recorded');
      return;
    }

    setStep('processing');
    setIsProcessing(true);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
        },
        body: JSON.stringify({
          model: 'arcee-ai/trinity-large-preview:free',
          messages: [
            {
              role: 'system',
              content: `You are a medical AI scribe. Extract structured clinical data from a doctor-patient conversation transcript. The conversation may be in any Indian language - understand it and respond in English.

Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{
  "complaints": [{"text": "complaint description", "duration": "duration", "severity": "mild|moderate|severe"}],
  "diagnoses": [{"code": "ICD-10 code", "text": "diagnosis name", "type": "primary|secondary", "certainty": "confirmed|provisional|differential"}],
  "medications": [{"name": "drug name", "dosage": "dosage", "frequency": "OD|BD|TDS|QID|SOS", "duration": "e.g. 5 days", "route": "Oral|IV|IM|Topical", "instructions": "special instructions"}],
  "labTests": [{"text": "test name", "priority": "routine|urgent|stat"}],
  "radiologyOrders": [{"type": "X-Ray|CT|MRI|USG", "bodyPart": "body part", "priority": "routine|urgent", "notes": "clinical notes"}],
  "advice": "patient advice and instructions",
  "followUpDays": "number of days",
  "vitals": {"bp": "", "spo2": "", "temp": "", "pulse": "", "weight": "", "sugar": "", "height": "", "rr": ""}
}

Rules:
- Extract ONLY what is mentioned in the conversation
- Use standard medical terminology in English
- For medications, use generic names when possible
- If vitals are mentioned, fill them in; leave empty string if not mentioned
- followUpDays should be just a number as string
- Be conservative - only add diagnoses the doctor explicitly states or implies`
            },
            {
              role: 'user',
              content: `Patient: ${patientName}\n\nDoctor-Patient Conversation Transcript:\n${text}`
            }
          ],
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';

      // Parse JSON from response, handling potential markdown wrapping
      let jsonStr = content.trim();
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
      }

      const parsed = JSON.parse(jsonStr);

      // Normalize into our types with IDs
      const scribeResult: ScribeResult = {
        complaints: (parsed.complaints || []).map((c: any, i: number) => ({
          id: `ai-${Date.now()}-${i}`,
          text: c.text || '',
          duration: c.duration || '',
          severity: c.severity || 'moderate',
        })),
        diagnoses: (parsed.diagnoses || []).map((d: any, i: number) => ({
          id: `ai-${Date.now()}-${i}`,
          code: d.code || '',
          text: d.text || '',
          type: d.type || 'primary',
          certainty: d.certainty || 'provisional',
        })),
        medications: (parsed.medications || []).map((m: any, i: number) => ({
          id: `ai-${Date.now()}-${i}`,
          name: m.name || '',
          dosage: m.dosage || '',
          frequency: m.frequency || 'OD',
          duration: m.duration || '',
          route: m.route || 'Oral',
          instructions: m.instructions || '',
          isGeneric: true,
        })),
        labTests: (parsed.labTests || []).map((t: any, i: number) => ({
          id: `ai-${Date.now()}-${i}`,
          text: t.text || '',
          priority: t.priority || 'routine',
        })),
        radiologyOrders: (parsed.radiologyOrders || []).map((r: any, i: number) => ({
          id: `ai-${Date.now()}-${i}`,
          type: r.type || 'X-Ray',
          bodyPart: r.bodyPart || '',
          priority: r.priority || 'routine',
          notes: r.notes || '',
        })),
        advice: parsed.advice || '',
        followUpDays: parsed.followUpDays || '15',
        vitals: parsed.vitals || {},
      };

      setResult(scribeResult);
      setStep('review');
      toast.success('AI analysis complete! Review the extracted data.');
    } catch (err) {
      console.error('AI Scribe error:', err);
      toast.error('Failed to process transcript. Please try again.');
      setStep('record');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = () => {
    if (result) {
      onApply(result);
      toast.success('Prescription data applied to consultation');
      onClose();
    }
  };

  const moveToEdit = () => {
    stopListening();
    setEditableTranscript(transcript);
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) { stopListening(); onClose(); } }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Scribe — {patientName}
          </DialogTitle>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex items-center gap-2 text-xs mb-2">
          {(['record', 'processing', 'review'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              {i > 0 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
              <Badge variant={step === s ? 'default' : 'outline'} className="text-[10px]">
                {i + 1}. {s === 'record' ? 'Record' : s === 'processing' ? 'Analyze' : 'Review'}
              </Badge>
            </div>
          ))}
        </div>

        {/* STEP 1: Record */}
        {step === 'record' && (
          <div className="space-y-4">
            {/* Language selector */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block flex items-center gap-1">
                <Languages className="w-3.5 h-3.5" /> Conversation Language
              </label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                disabled={isListening}
                className="w-full h-8 text-xs border rounded-md px-2 bg-background"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Recording controls */}
            <div className="flex flex-col items-center gap-4 py-4">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-destructive text-destructive-foreground animate-pulse shadow-lg shadow-destructive/30'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md'
                }`}
              >
                {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>
              <p className="text-xs text-muted-foreground">
                {isListening ? 'Listening... Click to stop' : 'Click to start recording conversation'}
              </p>
            </div>

            {/* Live transcript */}
            <div className="border rounded-xl bg-muted/30 p-3 min-h-[120px] max-h-[200px] overflow-y-auto">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Live Transcript</p>
              <p className="text-sm whitespace-pre-wrap">
                {transcript}
                {interimText && <span className="text-muted-foreground italic">{interimText}</span>}
                {!transcript && !interimText && (
                  <span className="text-muted-foreground text-xs">Transcript will appear here as you speak...</span>
                )}
              </p>
            </div>

            {/* Edit transcript before processing */}
            {transcript && !isListening && (
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                  <Edit3 className="w-3 h-3" /> Edit Transcript (optional)
                </p>
                <Textarea
                  value={editableTranscript || transcript}
                  onChange={e => setEditableTranscript(e.target.value)}
                  className="text-xs min-h-[80px]"
                  placeholder="Edit the transcript if needed before AI analysis..."
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {transcript && !isListening && (
                <>
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { setTranscript(''); setEditableTranscript(''); }}>
                    <RotateCcw className="w-3.5 h-3.5" /> Clear
                  </Button>
                  <Button size="sm" className="gap-1.5 flex-1 bg-foreground text-background hover:bg-foreground/90" onClick={processTranscript}>
                    <Sparkles className="w-3.5 h-3.5" /> Analyze with AI
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Processing */}
        {step === 'processing' && (
          <div className="flex flex-col items-center gap-4 py-12">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm font-medium">Analyzing conversation...</p>
            <p className="text-xs text-muted-foreground text-center max-w-sm">
              AI is extracting complaints, diagnoses, medications, lab orders, and advice from the conversation
            </p>
            <Progress value={66} className="w-48 h-1.5" />
          </div>
        )}

        {/* STEP 3: Review */}
        {step === 'review' && result && (
          <div className="space-y-4">
            <div className="border border-amber-500/30 bg-amber-500/5 rounded-lg p-2.5 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700">
                Please review the AI-extracted data carefully before applying. Verify all medications, dosages, and diagnoses.
              </p>
            </div>

            {/* Complaints */}
            {result.complaints.length > 0 && (
              <ReviewSection title="Chief Complaints" icon={<Stethoscope className="w-3.5 h-3.5" />} count={result.complaints.length}>
                {result.complaints.map(c => (
                  <div key={c.id} className="flex items-center justify-between text-xs border-b last:border-0 py-1.5">
                    <span>{c.text}</span>
                    <div className="flex gap-1.5">
                      <Badge variant="outline" className="text-[10px]">{c.duration}</Badge>
                      <Badge variant={c.severity === 'severe' ? 'destructive' : 'secondary'} className="text-[10px]">{c.severity}</Badge>
                    </div>
                  </div>
                ))}
              </ReviewSection>
            )}

            {/* Diagnoses */}
            {result.diagnoses.length > 0 && (
              <ReviewSection title="Diagnoses" icon={<Stethoscope className="w-3.5 h-3.5" />} count={result.diagnoses.length}>
                {result.diagnoses.map(d => (
                  <div key={d.id} className="flex items-center justify-between text-xs border-b last:border-0 py-1.5">
                    <span>{d.code} — {d.text}</span>
                    <div className="flex gap-1.5">
                      <Badge variant="outline" className="text-[10px]">{d.type}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{d.certainty}</Badge>
                    </div>
                  </div>
                ))}
              </ReviewSection>
            )}

            {/* Medications */}
            {result.medications.length > 0 && (
              <ReviewSection title="Medications" icon={<Pill className="w-3.5 h-3.5" />} count={result.medications.length}>
                {result.medications.map(m => (
                  <div key={m.id} className="text-xs border-b last:border-0 py-1.5">
                    <div className="font-medium">{m.name} — {m.dosage}</div>
                    <div className="text-muted-foreground">{m.route} • {m.frequency} • {m.duration} {m.instructions && `• ${m.instructions}`}</div>
                  </div>
                ))}
              </ReviewSection>
            )}

            {/* Lab Tests */}
            {result.labTests.length > 0 && (
              <ReviewSection title="Lab Tests" icon={<FlaskConical className="w-3.5 h-3.5" />} count={result.labTests.length}>
                {result.labTests.map(t => (
                  <div key={t.id} className="flex items-center justify-between text-xs border-b last:border-0 py-1.5">
                    <span>{t.text}</span>
                    <Badge variant="outline" className="text-[10px]">{t.priority}</Badge>
                  </div>
                ))}
              </ReviewSection>
            )}

            {/* Advice */}
            {result.advice && (
              <ReviewSection title="Advice" icon={<Edit3 className="w-3.5 h-3.5" />}>
                <p className="text-xs">{result.advice}</p>
              </ReviewSection>
            )}

            {/* Follow up */}
            {result.followUpDays && (
              <div className="text-xs text-muted-foreground">Follow-up in <strong>{result.followUpDays} days</strong></div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setStep('record')}>
                <RotateCcw className="w-3.5 h-3.5" /> Re-record
              </Button>
              <Button size="sm" className="gap-1.5 flex-1 bg-foreground text-background hover:bg-foreground/90" onClick={handleApply}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Apply to Consultation
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ReviewSection({ title, icon, count, children }: { title: string; icon: React.ReactNode; count?: number; children: React.ReactNode }) {
  return (
    <div className="border rounded-xl bg-card p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5 mb-2">
        {icon} {title} {count !== undefined && <Badge variant="secondary" className="text-[10px] ml-1">{count}</Badge>}
      </p>
      {children}
    </div>
  );
}
