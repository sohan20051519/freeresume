import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import EditorForm from '../components/editor/EditorForm';
import ResumePreview from '../components/resume/ResumePreview';

const EditorPage: React.FC = () => {
    const navigate = useNavigate();
    const resumePreviewRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = () => {
        const source = resumePreviewRef.current?.firstChild as HTMLElement;
        if (!source) {
            alert("Could not find resume content to generate PDF.");
            return;
        }

        setIsGenerating(true);

        // Get all style and link tags from the main document's head
        const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
            .map(el => el.outerHTML)
            .join('');

        const printHtml = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Your Resume</title>
                    ${styles}
                    <style>
                        @page {
                            size: A4;
                            margin: 0;
                        }
                        body {
                            margin: 0;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            
                            /* Apply scaling directly to the body */
                            width: 850px;
                            height: 1100px;
                            transform-origin: top left;
                            transform: scale(calc(210mm / 850px));
                            overflow: hidden;
                        }
                    </style>
                </head>
                <body>
                    ${source.outerHTML}
                    <script>
                        window.addEventListener('load', () => {
                            // A delay ensures all remote resources like fonts are loaded and rendered
                            setTimeout(() => {
                                window.focus();
                                window.print();
                                window.close();
                            }, 500); 
                        });
                    </script>
                </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            setIsGenerating(false);
            alert('Could not open a new window. Please disable your pop-up blocker and try again.');
            return;
        }

        printWindow.document.open();
        printWindow.document.write(printHtml);
        printWindow.document.close();

        // Reset the loading state after a delay, as we can't get a direct callback
        // from the print dialog in the other window.
        setTimeout(() => {
            setIsGenerating(false);
        }, 3000);
    };

    const GeneratingIndicator = (
         <div className="fixed inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-neumorphic text-center max-w-sm">
                <svg className="animate-spin h-10 w-10 text-brand-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">Preparing your PDF...</h3>
                <p className="text-gray-600 mt-2 text-sm">A new tab will open. Please use the "Save as PDF" option in the print dialog.</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-200">
            {isGenerating && GeneratingIndicator}

            {/* Left Side: Editor Form */}
            <div className="w-full md:w-1/2 lg:w-2/5 p-4 md:p-6 lg:p-8">
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
                            onClick={handleDownload}
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