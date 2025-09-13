
import React, { useState, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TEMPLATES, DUMMY_RESUME_DATA } from '../constants';
import { useResume } from '../context/ResumeContext';
import { Template } from '../types';

interface TemplatePreviewProps {
    template: Template;
    isHovered: boolean;
    onHover: () => void;
    onClick: () => void;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template, isHovered, onHover, onClick }) => {
    const { component: TemplateComponent, name } = template;
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0);

    useLayoutEffect(() => {
        const currentRef = containerRef.current;
        if (!currentRef) return;

        // Use ResizeObserver to dynamically calculate scale factor for a perfect fit
        const observer = new ResizeObserver(() => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                // The resume is rendered at a base width of 850px.
                // We calculate the scale factor needed to fit it perfectly into the container.
                setScale(containerWidth / 850);
            }
        });

        observer.observe(currentRef);

        return () => observer.disconnect();
    }, []);

    return (
        <div 
            className="group cursor-pointer"
            onMouseEnter={onHover}
            onClick={onClick}
        >
            <div className={`bg-gray-100 rounded-lg p-2 transition-all duration-300 ${isHovered ? 'shadow-neumorphic-inset' : 'shadow-neumorphic hover:shadow-neumorphic-sm'}`}>
                 <div 
                    ref={containerRef}
                    className="aspect-[8.5/11] w-full bg-white shadow-inner overflow-hidden rounded-md pointer-events-none"
                 >
                    {scale > 0 && (
                        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                            <div className="w-[850px] h-[1100px] bg-white">
                                <TemplateComponent data={DUMMY_RESUME_DATA} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <p className="text-center text-xs mt-2 font-semibold text-gray-700">{name}</p>
        </div>
    );
};


const TemplatesPage: React.FC = () => {
    const navigate = useNavigate();
    const { dispatch } = useResume();
    const [hoveredTemplateId, setHoveredTemplateId] = useState(TEMPLATES[0].id);

    const handleSelectTemplate = (templateId: string) => {
        dispatch({ type: 'SET_TEMPLATE', payload: templateId });
        navigate('/editor');
    };

    const HoveredTemplate = TEMPLATES.find(t => t.id === hoveredTemplateId)?.component;

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
                <header className="text-center mb-12">
                     <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Choose Your Template</h1>
                     <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                        Hover to preview a template. Click to start editing. You can change it again anytime.
                     </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Side: Template Grid */}
                    <div className="lg:col-span-1">
                        <div className="grid grid-cols-3 gap-3">
                            {TEMPLATES.map(template => (
                                <TemplatePreview
                                    key={template.id}
                                    template={template}
                                    isHovered={hoveredTemplateId === template.id}
                                    onHover={() => setHoveredTemplateId(template.id)}
                                    onClick={() => handleSelectTemplate(template.id)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Preview */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-8">
                           <div className="bg-gray-100 p-4 rounded-2xl shadow-neumorphic">
                                <div className="aspect-[8.5/11] w-full bg-white shadow-lg overflow-hidden">
                                    {HoveredTemplate && <HoveredTemplate data={DUMMY_RESUME_DATA} />}
                                </div>
                            </div>
                             <div className="text-center mt-6">
                                <button
                                    onClick={() => handleSelectTemplate(hoveredTemplateId)}
                                    className="px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
                                >
                                    Use This Template
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="text-center mt-16">
                    <button onClick={() => navigate('/')} className="text-gray-600 font-semibold hover:text-brand-primary transition-colors">
                        &larr; Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TemplatesPage;
