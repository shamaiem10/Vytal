"use client";

import { useState, useEffect, useRef } from "react";
import { Download, Brain, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Badge } from "@/components/ui/badge";

export default function Summaries() {
  const [bpData, setBpData] = useState([]);
  const [hrData, setHrData] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [aiNotes, setAiNotes] = useState({ summary: "", insights: [], recommendations: [] });
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch diary entries for charts
    fetch("http://localhost:5000/api/diary")
      .then((res) => res.json())
      .then((data) => {
        const bpArr = [];
        const hrArr = [];
        const moodCount = { Happy: 0, Sad: 0 };
        const moodMapping = { Excellent: "Happy", Good: "Happy", Fair: "Sad", Poor: "Sad" };

        data.forEach((entry) => {
          if (entry.bp && entry.bp.includes("/")) {
            const [systolic, diastolic] = entry.bp.split("/").map(Number);
            bpArr.push({ day: entry.date, systolic, diastolic });
          }
          if (entry.hr) hrArr.push({ day: entry.date, hr: Number(entry.hr) });
          if (entry.mood) {
            const category = moodMapping[entry.mood] || "Sad";
            moodCount[category] += 1;
          }
        });

        setBpData(bpArr);
        setHrData(hrArr);

        const moodArr = Object.keys(moodCount).map((key) => ({
          mood: key,
          count: moodCount[key],
          color: key === "Happy" ? "#10b981" : "#ef4444",
        }));

        setMoodData(moodArr);
      })
      .catch((err) => console.error("Error fetching diary data:", err));

    // Fetch AI summary
    fetch("http://localhost:5000/api/summaries/ai")
      .then((res) => res.json())
      .then((data) => {
        const summaryText = data.summary
          ? `Blood Pressure ${data.summary.blood_pressure_range}, Heart Rate ${data.summary.heart_rate_range}, Mood ${data.summary.mood_range}, Sugar ${data.summary.sugar_range}, Total Entries: ${data.summary.total_entries}`
          : "No summary available.";

        let insightsArr: string[] = [];
        if (data.insights) {
          insightsArr = Object.values(data.insights);
        }

        let recArr: string[] = [];
        if (data.recommendations) {
          const recObj = data.recommendations;
          if (recObj.follow_up) recArr.push(`Follow-up: ${recObj.follow_up}`);
          if (recObj.immediate) recArr.push(...recObj.immediate.map((r: string) => `Immediate: ${r}`));
          if (recObj.preventive) recArr.push(`Preventive: ${recObj.preventive}`);
        }

        setAiNotes({ summary: summaryText, insights: insightsArr, recommendations: recArr });
      })
      .catch((err) => {
        console.error("Error fetching AI summary:", err);
        setAiNotes({ summary: "No AI summary available.", insights: [], recommendations: [] });
      });
  }, []);

  const handleExport = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Health_Report.pdf");
  };

  return (
    <div>
      {/* Header & Export */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Health Summaries</h1>
          <p className="text-muted-foreground">AI-powered analysis of your health trends and patterns.</p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* Report container */}
      <div ref={reportRef} className="p-6 bg-white text-black space-y-6">
        {/* AI Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Summary
            </CardTitle>
            <CardDescription>Generated from your recent diary entries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary */}
            <div className="p-3 bg-gray-100 rounded">
              <h4 className="font-medium mb-1">Summary:</h4>
              <p className="text-sm whitespace-pre-wrap">{aiNotes.summary}</p>
            </div>

            {/* Key Insights */}
            {aiNotes.insights.length > 0 && (
              <div className="p-3 bg-gray-50 rounded">
                <h4 className="font-medium mb-2">Key Insights:</h4>
                <ul className="space-y-1">
                  {aiNotes.insights.map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {aiNotes.recommendations.length > 0 && (
              <div className="p-3 bg-gray-50 rounded">
                <h4 className="font-medium mb-2">Recommendations:</h4>
                <div className="flex flex-wrap gap-2">
                  {aiNotes.recommendations.map((rec, idx) => (
                    <Badge key={idx} variant="secondary">
                      {rec}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Blood Pressure */}
          <Card>
            <CardHeader>
              <CardTitle>Blood Pressure Trend</CardTitle>
              <CardDescription>Daily readings</CardDescription>
            </CardHeader>
            <CardContent style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bpData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="systolic" stroke="#1d4ed8" strokeWidth={2} />
                  <Line type="monotone" dataKey="diastolic" stroke="#dc2626" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Heart Rate */}
          <Card>
            <CardHeader>
              <CardTitle>Heart Rate Trend</CardTitle>
              <CardDescription>Daily measurements</CardDescription>
            </CardHeader>
            <CardContent style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hrData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hr" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Mood Chart */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Mood Overview</CardTitle>
            <CardDescription>Happy vs Sad days</CardDescription>
          </CardHeader>
          <CardContent style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moodData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  dataKey="count"
                >
                  {moodData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} days`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mood Legend */}
        <div className="mt-4 flex gap-6">
          {moodData.map((mood, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div style={{ width: 16, height: 16, backgroundColor: mood.color, borderRadius: 4 }}></div>
              <div>
                <p className="font-medium">{mood.mood}</p>
                <p className="text-sm">{mood.count} days</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-gray-600">
          Report generated automatically from your health diary. Consult your physician for detailed interpretation.
        </p>
      </div>
    </div>
  );
}
