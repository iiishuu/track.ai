# Plan: Scan Experience + Report Page Upgrade

## Summary
Upgrade complet de l'expérience scan et rapport : page de chargement animée, scan page enrichie, rapport professionnel complet, téléchargement PDF, design moderne.

## Steps

### 1. Install shadcn components
- `separator`, `collapsible`, `tooltip`, `skeleton`

### 2. i18n keys
- Add ~60 new keys to `types.ts`, `en.ts`, `fr.ts` (loading page, enhanced scan, report sections)

### 3. Loading page with animated progress
- Create `/scan/loading/page.tsx` + `ScanLoading.tsx` + `useScanWithProgress.ts`
- Modify `ScanForm.tsx` to redirect to loading page
- 5 animated steps with personalized text + fun facts
- Simulated progress while real API runs in background

### 4. Enhanced scan page
- Create `ScanInfoCards.tsx` (3 cards explaining what scan does)
- Create `RecentScans.tsx` (last 5 scans)
- Expand scan page layout

### 5. Report header + competitive analysis
- Create `ReportHeader.tsx` (domain, sector, date, download btn)
- Create `DownloadButton.tsx` (window.print)
- Create `CompetitiveAnalysis.tsx` (full share of voice bar chart)

### 6. Source analysis + enhanced metrics
- Create `SourceAnalysis.tsx` (influence sources list)
- Enhance `MetricsGrid.tsx` (icons, tooltips, 2 new cards)

### 7. Enhanced query result cards
- Convert `QueryResultCard.tsx` to collapsible with full response + sources

### 8. Enhanced score card + recommendations
- Larger animated gauge in `ScoreCard.tsx`
- Priority icons + colored borders in `RecommendationList.tsx`

### 9. Assemble report page
- Restructure `report/[id]/page.tsx` with all new sections

### 10. Print CSS
- Add `@media print` styles to `globals.css`

## Commits: one per step above
