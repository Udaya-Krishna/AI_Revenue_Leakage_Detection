import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { useGlobalTheme } from "./GlobalThemeContext";

const FlowchartViewer = ({ isOpen = true, onClose = () => {} }) => {
  const { isDark } = useGlobalTheme();
  const mermaidRef = useRef(null);
  const scrollContainerRef = useRef(null); // Ref for the scrollable container
  
  const [zoomLevel, setZoomLevel] = useState(1);
  const baseDimensions = useRef({ width: 0, height: 0 });
  const [renderId, setRenderId] = useState(0);

  const flowchartCode = `
flowchart TD
    %% Core pipeline in center
    User[👤 USER] --> DomainSelect[🎯 Domain Selection]
    DomainSelect -->|Supermarket| UploadSuper[📤 Upload Dataset]
    DomainSelect -->|Telecom| UploadTele[📤 Upload Dataset]

    UploadSuper --> |POST /api/upload| Flask[⚙ Flask<br/>backend]
    UploadTele --> |POST /api/upload| Flask

    Flask --> SaveFile[💾 Save to /uploads/<br/>session_id.csv]
    SaveFile --> Analysis[🔍 Integrated Analysis<br/>integrated_analysis.py]
    Analysis --> DataLoad[📥 Load CSV<br/>pandas.read_csv]
    DataLoad --> DataPreprocess[🧹 Preprocessing<br/>Feature Engineering<br/>Normalization]

    DataPreprocess --> ModelChoice{🧠 Model Selection}
    ModelChoice -->|Supermarket| SuperModel[📊 Supermarket Model<br/>XGBoost + Rules]
    ModelChoice -->|Telecom| TelecomModel[📞 Telecom Model<br/>XGBoost + Thresholds]

    SuperModel --> ModelProcessing[⚡ Model Processing<br/>1. Feature Extraction<br/>2. Anomaly Scoring<br/>3. Threshold Application]
    TelecomModel --> ModelProcessing
    ModelProcessing --> AnomalyDetection[🚨 Anomaly Classification<br/>Missing Charges<br/>Usage Mismatch<br/>Payment Issues<br/>Confidence Scoring]

    AnomalyDetection --> ResultsProcessing[📊 Results Processing<br/>Metrics<br/>Viz Data<br/>Format Anomalies]
    ResultsProcessing --> OutputStorage[💾 Store Results<br/>/outputs/session.json]
    OutputStorage --> |JSON Response| ResultsAPI[📊 GET /api/results/<br/>session_id]
    ResultsAPI --> Frontend[🌐 React Frontend<br/>Results Display]

    %% Far left: Chatbot
    User --> |Can interact anytime| Chatbot[💬 Chatbot<br/>Rule-based Assistance]
    Chatbot --> |Responses| User

    %% Left of pipeline: Visualization
    Frontend --> VizDashboard[📈 Visualization Dashboard<br/>Chart.js Interactive<br/>Anomaly Trends]
    VizDashboard --> |Interactive Experience| User
    
    %% Right of pipeline: Dataset Downloads
    Frontend --> DatasetDownload[⬇ Download Dataset Options]
    DatasetDownload --> EntireCSV[📂 Entire Dataset CSV]
    DatasetDownload --> CleanCSV[🧹 Clean Dataset CSV]
    DatasetDownload --> ErrorCSV[❌ Error Dataset CSV]
    EntireCSV --> |CSV File| User
    CleanCSV --> |CSV File| User
    ErrorCSV --> |CSV File| User

    %% Far right: Reports
    Frontend --> ReportBranch{📋 Report Generation}
    ReportBranch --> StandardReport[📄 Standard Report<br/>Gemini + Python<br/>Viz Summaries]
    ReportBranch --> DetailedReport[📄 Detailed Report<br/>Ollama AI<br/>Accurate Results]
    ReportBranch --> LLMSummary[🤖 LLM Summary<br/>Google GenAI<br/>Executive Overview]

    DetailedReport --> |GET /api/download_detailed_report| DetailedDownload[📑 Download .docx Detailed Report]
    StandardReport --> |GET /api/download_anomalies| CSVDownload[📋 Download Anomalies CSV]

    DetailedDownload --> |File Stream| User
    CSVDownload --> |CSV File| User

    %% Styling
    classDef userClass fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef frontendClass fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef backendClass fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef mlClass fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef storageClass fill:#fce4ec,stroke:#880e4f,stroke-width:2px

    class User,DomainSelect,Chatbot userClass
    class UploadSuper,UploadTele,Frontend,DatasetDownload,VizDashboard frontendClass
    class Flask,Analysis,ResultsAPI,ReportBranch,StandardReport,DetailedReport,LLMSummary backendClass
    class ModelChoice,SuperModel,TelecomModel,AnomalyDetection,ModelProcessing,ResultsProcessing mlClass
    class SaveFile,OutputStorage,DetailedDownload,CSVDownload,EntireCSV,CleanCSV,ErrorCSV,DataLoad,DataPreprocess storageClass
  `;

  useEffect(() => {
    if (baseDimensions.current.width === 0) return;

    const svg = mermaidRef.current?.querySelector('svg');
    if (svg) {
      const newWidth = baseDimensions.current.width * zoomLevel;
      const newHeight = baseDimensions.current.height * zoomLevel;
      svg.style.width = `${newWidth}px`;
      svg.style.height = `${newHeight}px`;
    }
  }, [zoomLevel, renderId]);

  const renderFlowchart = useCallback(async () => {
    if (!window.mermaid || !mermaidRef.current) return;
    const container = mermaidRef.current;
    container.innerHTML = `<div class="text-center p-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div><p>Rendering flowchart...</p></div>`;
    
    try {
      window.mermaid.initialize({ startOnLoad: false, theme: isDark ? 'dark' : 'default', flowchart: { useMaxWidth: true, htmlLabels: true, rankSpacing: 50, nodeSpacing: 50 }, themeVariables: { primaryColor: isDark ? '#06b6d4' : '#3b82f6', primaryTextColor: isDark ? '#ffffff' : '#1f2937', primaryBorderColor: isDark ? '#0891b2' : '#2563eb', lineColor: isDark ? '#64748b' : '#6b7280' }});
      const { svg } = await window.mermaid.render('flowchart', flowchartCode);
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = svg;
        const svgEl = mermaidRef.current.querySelector('svg');
        if (svgEl) {
          const bbox = svgEl.getBBox();
          baseDimensions.current = { width: bbox.width, height: bbox.height };

          svgEl.removeAttribute('width');
          svgEl.removeAttribute('height');
          svgEl.style.maxWidth = 'none';
          svgEl.style.maxHeight = 'none';

          // Calculate the initial "fit-to-width" zoom level
          if (scrollContainerRef.current) {
              // The content area has p-6 (1.5rem or 24px) padding on each side
              const containerPadding = 48;
              const containerWidth = scrollContainerRef.current.clientWidth - containerPadding;
              const svgWidth = baseDimensions.current.width;
              
              let initialZoom = 1;
              if (svgWidth > 0 && svgWidth > containerWidth) {
                  initialZoom = containerWidth / svgWidth;
              }
              setZoomLevel(initialZoom);
          } else {
              setZoomLevel(1);
          }

          setRenderId(id => id + 1);
        }
      }
    } catch (err) {
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = `<div class="text-red-500 p-4">Error rendering flowchart: ${err.message}</div>`;
      }
    }
  }, [isDark, flowchartCode]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (window.mermaid) {
        renderFlowchart();
      } else if (!document.querySelector('script[src*="mermaid"]')) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.6.1/mermaid.min.js';
        script.onload = () => renderFlowchart();
        script.onerror = () => { if (mermaidRef.current) mermaidRef.current.innerHTML = `<div class="text-red-500 p-4">Error loading flowchart library</div>`; };
        document.head.appendChild(script);
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, renderFlowchart]);

  useEffect(() => {
    const handleKeyPress = (e) => { if (isOpen && e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onClose]);

  const handleDownloadSVG = () => {
    const svgElement = mermaidRef.current?.querySelector('svg');
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.href = svgUrl;
      link.download = 'revenue-hunter-architecture.svg';
      link.click();
      URL.revokeObjectURL(svgUrl);
    }
  };

  const handleZoom = (factor) => {
    setZoomLevel(prev => Math.max(0.2, Math.min(3, prev * factor)));
  };
  
  const handleResetAndRefresh = useCallback(() => {
    renderFlowchart(); // This will re-render and calculate the new fit-to-width zoom
  }, [renderFlowchart]);

  if (!isOpen) return null;

  const themeClasses = { overlay: isDark ? 'bg-black/90 backdrop-blur-sm' : 'bg-black/80 backdrop-blur-sm', modal: isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200', header: isDark ? 'bg-gray-800/60 border-b border-gray-700' : 'bg-slate-50 border-b border-gray-200', content: isDark ? 'bg-gray-900' : 'bg-white', button: isDark ? 'text-gray-300 hover:text-cyan-400 bg-gray-800 hover:bg-gray-700 border border-gray-700' : 'text-gray-700 hover:text-blue-600 bg-white hover:bg-gray-50 border border-gray-200', closeButton: isDark ? 'text-gray-300 hover:text-white bg-gray-800/80 hover:bg-gray-700/80' : 'text-gray-700 hover:text-blue-600 bg-white/90 hover:bg-gray-50/90', primaryText: isDark ? 'text-white' : 'text-gray-900', secondaryText: isDark ? 'text-gray-300' : 'text-gray-600', mutedText: isDark ? 'text-gray-400' : 'text-gray-500', };
  const LegendItem = ({ color, borderColor, label }) => (<div className="flex items-center"><span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color, border: `1px solid ${borderColor}` }}></span><span>{label}</span></div>);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${themeClasses.overlay}`}>
      <div className={`relative w-full max-w-7xl max-h-[95vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col ${themeClasses.modal}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 shrink-0 ${themeClasses.header}`}>
          <div>
            <h3 className={`text-2xl font-bold ${themeClasses.primaryText}`}>System Architecture</h3>
            <p className={`text-sm ${themeClasses.secondaryText} mt-1`}>Complete workflow from data upload to revenue recovery</p>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => handleZoom(0.8)} className={`p-2 rounded-lg ${themeClasses.button} transition-all hover:scale-110`} title="Zoom Out"><ZoomOut className="w-4 h-4" /></button>
            <button onClick={handleResetAndRefresh} className={`p-2 rounded-lg ${themeClasses.button} transition-all hover:scale-110`} title="Refresh & Reset Zoom"><RotateCw className="w-4 h-4" /></button>
            <button onClick={() => handleZoom(1.2)} className={`p-2 rounded-lg ${themeClasses.button} transition-all hover:scale-110`} title="Zoom In"><ZoomIn className="w-4 h-4" /></button>
            <button onClick={handleDownloadSVG} className={`p-2 rounded-lg ${themeClasses.button} transition-all hover:scale-110`} title="Download as SVG"><Download className="w-4 h-4" /></button>
            <button onClick={onClose} className={`ml-2 w-10 h-10 rounded-full ${themeClasses.closeButton} flex items-center justify-center transition-all shadow-lg hover:scale-110`}><X className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Flowchart Content */}
        <div ref={scrollContainerRef} className={`grow overflow-auto ${themeClasses.content}`}>
          <div className="p-6 h-full w-full">
            <div 
              ref={mermaidRef} 
              className="w-fit h-fit mx-auto transition-all duration-300"
            >
              {/* SVG is injected here */}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`shrink-0 ${themeClasses.header} px-6 py-3`}>
          <div className="flex items-center justify-between">
            <div className={`text-xs ${themeClasses.mutedText}`}>
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
                <LegendItem color="#e1f5fe" borderColor="#01579b" label="User Flow" />
                <LegendItem color="#f3e5f5" borderColor="#4a148c" label="Frontend" />
                <LegendItem color="#e8f5e8" borderColor="#1b5e20" label="Backend" />
                <LegendItem color="#fff3e0" borderColor="#e65100" label="ML Model" />
                <LegendItem color="#fce4ec" borderColor="#880e4f" label="Storage" />
              </div>
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Use scroll or zoom controls to navigate • ESC to close</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowchartViewer;