"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pdfkit_1 = __importDefault(require("pdfkit"));
const docx_1 = require("docx");
const execution_1 = __importDefault(require("../models/execution"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = (0, express_1.Router)();
// ─── GET /agent/export/pdf/:id ────────────────────────────────────────────────
router.get('/pdf/:id', async (req, res) => {
    const queryId = req.params.id;
    const orConditions = [{ id: queryId }];
    if (mongoose_1.default.Types.ObjectId.isValid(queryId)) {
        orConditions.push({ _id: queryId });
    }
    const item = await execution_1.default.findOne({ $or: orConditions });
    if (!item) {
        res.status(404).json({ success: false, error: 'Execution record not found.' });
        return;
    }
    const doc = new pdfkit_1.default({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Execution_Report_${item.id}.pdf"`);
    doc.pipe(res);
    // Professional Agentic Brand Header
    doc.rect(0, 0, doc.page.width, 85).fill('#0f172a');
    doc.fillColor('#38bdf8').fontSize(22).font('Helvetica-Bold').text('Agentic AI Execution Report', 50, 25);
    doc.fillColor('#94a3b8').fontSize(11).font('Helvetica').text('Execution State Details', 50, 52);
    doc.moveDown(3);
    doc.fillColor('#000000');
    doc.fontSize(10).font('Helvetica-Bold').text(`Execution ID: ${item.id} | Status: ${item.status?.toUpperCase()}`);
    doc.fontSize(10).font('Helvetica').text(`Timestamp: ${new Date(item.timestamp).toLocaleString()}`);
    doc.moveDown(2);
    const addSection = (title, content) => {
        if (!content)
            return;
        doc.fontSize(16).font('Helvetica-Bold').fillColor('#0f172a').text(title);
        doc.moveDown(0.5);
        let inCodeBlock = false;
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.trim().startsWith('```')) {
                inCodeBlock = !inCodeBlock;
                doc.moveDown(0.5);
                continue;
            }
            if (inCodeBlock) {
                doc.fontSize(10).font('Courier').fillColor('#334155').text(line, { lineGap: 2 });
            }
            else {
                if (line.trim().startsWith('# ')) {
                    doc.fontSize(14).font('Helvetica-Bold').fillColor('#1e293b').text(line.replace(/^#\s/, ''), { lineGap: 4 });
                }
                else if (line.trim().startsWith('## ')) {
                    doc.fontSize(12).font('Helvetica-Bold').fillColor('#334155').text(line.replace(/^##\s/, ''), { lineGap: 3 });
                }
                else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                    doc.fontSize(11).font('Helvetica').fillColor('#475569').text(`  • ${line.trim().substring(2)}`, { lineGap: 2 });
                }
                else if (line.trim() === '') {
                    doc.moveDown(0.5);
                }
                else {
                    doc.fontSize(11).font('Helvetica').fillColor('#475569').text(line, { lineGap: 2 });
                }
            }
        }
        doc.moveDown(1.5);
    };
    addSection('Execution Goal', item.goal);
    addSection('Orchestrator Plan', item.plan);
    addSection('Final Response', item.refinedResult || item.executionResult);
    // Add Critic Feedback if available
    const critique = item.critique;
    if (critique) {
        const feedback = `Score: ${critique.qualityScore}/100\nSatisfactory: ${critique.isSatisfactory}\nIssues Detected: ${critique.issuesFound?.join(', ') || 'None'}`;
        addSection('Critic Feedback', feedback);
    }
    if (item.refinedPlan) {
        addSection('Refined Plan', item.refinedPlan);
    }
    doc.end();
});
// ─── GET /agent/export/docx/:id ───────────────────────────────────────────────
router.get('/docx/:id', async (req, res) => {
    const queryId = req.params.id;
    const orConditions = [{ id: queryId }];
    if (mongoose_1.default.Types.ObjectId.isValid(queryId)) {
        orConditions.push({ _id: queryId });
    }
    const item = await execution_1.default.findOne({ $or: orConditions });
    if (!item) {
        res.status(404).json({ success: false, error: 'Execution record not found.' });
        return;
    }
    const parseMarkdown = (text) => {
        if (!text)
            return [];
        const lines = text.split('\n');
        const paras = [];
        let inCodeBlock = false;
        let codeLines = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.trim().startsWith('```')) {
                if (inCodeBlock) {
                    paras.push(new docx_1.Paragraph({
                        children: [new docx_1.TextRun({ text: codeLines.join('\n'), font: 'Courier New', size: 20 })],
                        shading: { fill: "F1F5F9" },
                        spacing: { before: 120, after: 120 }
                    }));
                    codeLines = [];
                }
                inCodeBlock = !inCodeBlock;
                continue;
            }
            if (inCodeBlock) {
                codeLines.push(line);
                continue;
            }
            const trimmed = line.trim();
            if (trimmed.startsWith('# ')) {
                paras.push(new docx_1.Paragraph({ text: trimmed.replace(/^#\s/, ''), heading: docx_1.HeadingLevel.HEADING_1 }));
            }
            else if (trimmed.startsWith('## ')) {
                paras.push(new docx_1.Paragraph({ text: trimmed.replace(/^##\s/, ''), heading: docx_1.HeadingLevel.HEADING_2 }));
            }
            else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                paras.push(new docx_1.Paragraph({ text: trimmed.substring(2), bullet: { level: 0 } }));
            }
            else if (trimmed !== '') {
                paras.push(new docx_1.Paragraph({ text: trimmed }));
            }
        }
        return paras;
    };
    const children = [
        new docx_1.Paragraph({ text: 'Agentic AI Execution Report', heading: docx_1.HeadingLevel.TITLE }),
        new docx_1.Paragraph({ children: [new docx_1.TextRun({ text: `ID: ${req.params.id}  |  Status: ${item.status?.toUpperCase() ?? 'UNKNOWN'}  |  Quality Score: ${item.qualityScore}/100`, bold: true })] }),
        new docx_1.Paragraph({ children: [new docx_1.TextRun({ text: `Date: ${new Date(item.timestamp).toLocaleString()}` })] }),
        new docx_1.Paragraph({ text: '' }),
        new docx_1.Paragraph({ text: 'Goal', heading: docx_1.HeadingLevel.HEADING_1 }),
        new docx_1.Paragraph({ text: item.goal || '' }),
        new docx_1.Paragraph({ text: '' }),
        new docx_1.Paragraph({ text: 'Plan', heading: docx_1.HeadingLevel.HEADING_1 }),
        ...parseMarkdown(item.plan || ''),
        new docx_1.Paragraph({ text: '' }),
        new docx_1.Paragraph({ text: 'Execution Result', heading: docx_1.HeadingLevel.HEADING_1 }),
        ...parseMarkdown((item.refinedResult || item.executionResult) || ''),
    ];
    const critique = item.critique;
    if (critique) {
        children.push(new docx_1.Paragraph({ text: '' }));
        children.push(new docx_1.Paragraph({ text: 'Critic Feedback', heading: docx_1.HeadingLevel.HEADING_1 }));
        children.push(new docx_1.Paragraph({ text: `Score: ${critique.qualityScore}/100` }));
        children.push(new docx_1.Paragraph({ text: `Satisfactory: ${critique.isSatisfactory}` }));
        children.push(new docx_1.Paragraph({ text: `Issues Detected: ${critique.issuesFound?.join(', ') || 'None'}` }));
    }
    if (item.refinedPlan) {
        children.push(new docx_1.Paragraph({ text: '' }));
        children.push(new docx_1.Paragraph({ text: 'Refined Plan', heading: docx_1.HeadingLevel.HEADING_1 }));
        children.push(...parseMarkdown(item.refinedPlan));
    }
    const doc = new docx_1.Document({
        styles: {
            default: {
                heading1: { run: { color: "1E293B", size: 32, bold: true, font: "Helvetica" }, paragraph: { spacing: { before: 240, after: 120 } } },
                heading2: { run: { color: "334155", size: 28, bold: true, font: "Helvetica" }, paragraph: { spacing: { before: 240, after: 120 } } },
                title: { run: { color: "0F172A", size: 44, bold: true, font: "Helvetica" }, paragraph: { spacing: { after: 240 } } },
                document: { run: { size: 22, font: "Helvetica", color: "475569" }, paragraph: { spacing: { after: 120 } } }
            }
        },
        sections: [{ children }]
    });
    const buffer = await docx_1.Packer.toBuffer(doc);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="Execution_Report_${item.id}.docx"`);
    res.send(buffer);
});
exports.default = router;
//# sourceMappingURL=export.routes.js.map