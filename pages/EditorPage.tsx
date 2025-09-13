
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import EditorForm from '../components/editor/EditorForm';
import ResumePreview from '../components/resume/ResumePreview';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const EditorPage: React.FC = () => {
    const { state } = useResume();
    const navigate = useNavigate();
    const resumePreviewRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileName, setFileName] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const openDownloadModal = () => {
        const defaultName = `Resume-${state.data.personalInfo.fullName.replace(/\s+/g, '_')}.pdf`;
        setFileName(defaultName);
        setIsModalOpen(true);
    };

    const handleDownload = async () => {
        if (!resumePreviewRef.current) {
            alert("Resume preview is not available.");
            return;
        }

        setIsGenerating(true);
        setIsModalOpen(false);

        // Allow UI to update before capturing
        await new Promise(resolve => setTimeout(resolve, 100));

        const elementToCapture = resumePreviewRef.current;
        const originalStyle = elementToCapture.style.cssText;

        try {
            // Temporarily change styles for full content capture
            elementToCapture.style.height = 'auto';
            elementToCapture.style.overflow = 'visible';

            const canvas = await html2canvas(elementToCapture, {
                scale: 3, // Higher scale for better quality
                useCORS: true,
                // Ensure it captures the full scroll height
                windowHeight: elementToCapture.scrollHeight,
            });

            // Restore styles immediately after capture
            elementToCapture.style.cssText = originalStyle;

            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'in',
                format: 'letter'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const canvasAspectRatio = canvas.height / canvas.width;
            const totalPdfHeight = pdfWidth * canvasAspectRatio;

            let heightLeft = totalPdfHeight;
            let position = 0;

            // Add the first page
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
            heightLeft -= pdfHeight;

            // Add more pages if content overflows
            while (heightLeft > 0) {
                position -= pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
                heightLeft -= pdfHeight;
            }
            
            const finalFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
            pdf.save(finalFileName);

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Sorry, there was an error generating the PDF. Please try again.");
        } finally {
            // Ensure styles are restored even if there's an error
            if(elementToCapture.style.cssText !== originalStyle){
               elementToCapture.style.cssText = originalStyle;
            }
            setIsGenerating(false);
        }
    };

    const DownloadModal = (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md m-4">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Download Resume</h3>
                <div>
                    <label htmlFor="filename" className="block text-sm font-medium text-gray-600 mb-1">Filename</label>
                    <input 
                        id="filename"
                        type="text" 
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="w-full p-3 bg-gray-100 rounded-lg shadow-neumorphic-sm-inset focus:outline-none focus:ring-2 focus:ring-brand-primary transition-shadow"
                    />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-neumorphic-sm hover:shadow-neumorphic-sm-inset transition-all duration-200">
                        Cancel
                    </button>
                    <button onClick={handleDownload} disabled={isGenerating} className="px-5 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-secondary disabled:bg-gray-400 transition-all duration-200">
                        {isGenerating ? 'Generating...' : 'Download'}
                    </button>
                </div>
            </div>
        </div>
    );
    
    const GeneratingIndicator = (
         <div className="fixed inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-neumorphic text-center max-w-sm">
                <svg className="animate-spin h-10 w-10 text-brand-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">Generating your PDF...</h3>
                <p className="text-gray-600 mt-2 text-sm">This might take a moment.</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-200">
            {isModalOpen && DownloadModal}
            {isGenerating && GeneratingIndicator}

            {/* Left Side: Editor Form */}
            <div className="w-full md:w-1/2 lg:w-2/5 p-4 md:p-6 lg:p-8 overflow-y-auto" style={{maxHeight: 'calc(100vh - 4rem)'}}>
                <div className="bg-gray-100 rounded-2xl shadow-neumorphic-inset p-6">
                    <EditorForm />
                </div>
            </div>

            {/* Right Side: Resume Preview */}
            <div className="w-full md:w-1/2 lg:w-3/5 p-4 md:p-6 lg:p-8">
                <div className="sticky top-24">
                    <div className="mb-4 flex flex-col sm:flex-row justify-end gap-3">
                         <button
                            onClick={() => navigate('/templates')}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-bold rounded-full shadow-neumorphic-sm hover:shadow-neumorphic-sm-inset transform hover:scale-105 transition-all duration-300 ease-in-out"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                            <span>Change Template</span>
                        </button>
                        <button
                            onClick={openDownloadModal}
                            disabled={isGenerating}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <span>Download PDF</span>
                        </button>
                    </div>
                    <ResumePreview ref={resumePreviewRef} />
                </div>
            </div>
        </div>
    );
};

export default EditorPage;
